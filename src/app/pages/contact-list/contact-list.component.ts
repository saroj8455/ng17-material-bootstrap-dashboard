import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Contacts } from '@capacitor-community/contacts'; // Native Plugin
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Contact } from '../../services/contacts.service';
import { ApiService } from '../../services/api.service';
import { Share } from '@capacitor/share'; // Import Share
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialConfigModule } from '../../primeconfig/materialconfig.module';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MaterialConfigModule,
  ],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = []; // Stores filtered data for UI
  searchTerm: string = ''; // User input
  searchControl = new FormControl('', { nonNullable: true });
  private refreshContacts$ = new Subject<void>();
  isLoading = false;
  isUploading = false;

  // ➤ NEW VARIABLES
  isAddingContact = false;
  newContact = { fullName: '', mobile: '' };

  // 📦 Base contacts stream (API)

  // private contacts$ = this.api.getContacts().pipe(
  //   map((data) => {
  //     // 1️⃣ Remove duplicates by mobile
  //     const mapByMobile = new Map<string, Contact>();
  //     data.forEach((c) => mapByMobile.set(c.mobile, c as Contact));
  //     return [...mapByMobile.values()];
  //   }),
  //   // 2️⃣ Sort A–Z by name
  //   map((contacts) =>
  //     contacts.sort((a, b) =>
  //       a.fullName.localeCompare(b.fullName, undefined, {
  //         sensitivity: 'base',
  //       })
  //     )
  //   ),
  //   shareReplay(1) // ✅ prevent multiple API calls
  // );
  private contacts$ = this.refreshContacts$.pipe(
    startWith(void 0), // initial load
    switchMap(() => this.api.getContacts()),
    map((data) => {
      const mapByMobile = new Map<string, Contact>();
      data.forEach((c) => mapByMobile.set(c.mobile, c as Contact));
      return [...mapByMobile.values()];
    }),
    map((contacts) =>
      contacts.sort((a, b) =>
        a.fullName.localeCompare(b.fullName, undefined, {
          sensitivity: 'base',
        })
      )
    ),
    shareReplay(1)
  );

  // 🎯 Final filtered stream
  filteredContacts$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) => {
      const normalizedTerm = term.toLowerCase().trim();
      return this.contacts$.pipe(
        map((contacts) =>
          normalizedTerm
            ? contacts.filter(
                (c) =>
                  c.fullName.toLowerCase().includes(normalizedTerm) ||
                  String(c.mobile).includes(normalizedTerm)
              )
            : contacts
        )
      );
    }),
    map((contacts) => {
      this.isLoading = false;
      return contacts;
    }),
    catchError(() => {
      this.isLoading = false;
      this.showToast('Could not load contacts');
      return of([]);
    })
  );

  showClear$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    map((value) => !!value)
  );

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.isLoading = true;
    this.api.getContacts().subscribe({
      next: (data) => {
        // ➤ LOGIC: Remove Duplicates by Mobile Number
        // We use a Map because keys (mobile numbers) must be unique.
        const uniqueContactsMap = new Map();

        data.forEach((contact) => {
          // If mobile doesn't exist in map, add it.
          // (If you want to keep the *latest* version, just use .set() without the if check)
          if (!uniqueContactsMap.has(contact.mobile)) {
            uniqueContactsMap.set(contact.mobile, contact);
          }
        });

        // Convert Map values back to an Array
        let uniqueList = Array.from(uniqueContactsMap.values());

        // 3. ➤ SORT ALPHABETICALLY (A-Z)
        this.contacts = uniqueList.sort((a, b) =>
          a.fullName.toLowerCase().localeCompare(b.fullName.toLowerCase())
        );

        // this.contacts = data as Contact[];
        this.filteredContacts = this.contacts; // Initialize filtered list with everything
        this.onSearch(); // Re-apply search if term exists
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Could not load contacts');
      },
    });
  }

  // ➤ NEW: Pick from Device & Upload to API
  async pickAndUpload() {
    try {
      // 1. Check Permissions
      const perm = await Contacts.requestPermissions();
      if (perm.contacts !== 'granted') {
        this.showToast('Permission denied. Cannot read contacts.');
        return;
      }

      this.isUploading = true;
      this.showToast('Scanning device contacts...');

      // 2. Get ALL Contacts from Phone (Google, SIM, Device)
      const result = await Contacts.getContacts({
        projection: { name: true, phones: true },
      });

      // 3. Filter & Clean Data
      const validContacts = result.contacts
        .filter((c) => c.name?.display && c.phones?.[0]?.number) // Must have Name & Mobile
        .map((c) => {
          // Clean: Remove spaces, dashes, +91, parens
          const raw = c.phones![0].number!;
          const clean = raw.replace(/[^0-9]/g, '').slice(-10); // Keep last 10 digits

          return {
            fullName: c.name!.display!,
            mobile: clean,
          };
        })
        .filter((c) => c.mobile.length === 10); // Only keep valid 10-digit numbers

      if (validContacts.length === 0) {
        this.showToast('No contacts with valid 10-digit mobile numbers found.');
        this.isUploading = false;
        return;
      }

      console.log(`Found ${validContacts.length} valid contacts to upload.`);

      // 4. Upload in Batches (Safety mechanism for "All" contacts)
      // We send 100 contacts at a time so the API doesn't time out.
      const BATCH_SIZE = 100;
      let successCount = 0;

      for (let i = 0; i < validContacts.length; i += BATCH_SIZE) {
        const batch = validContacts.slice(i, i + BATCH_SIZE);

        // Convert to 'unknown' first to bypass ID requirement issue
        await this.api.bulkCreate(batch as any).toPromise();

        successCount += batch.length;
        console.log(
          `Uploaded batch: ${successCount} / ${validContacts.length}`
        );
      }

      // 5. Done
      this.showToast(`Success! Uploaded ${successCount} contacts.`);
      this.loadContacts(); // Refresh list from API
    } catch (error: any) {
      console.error('Upload Error:', error);
      this.showToast('Upload failed. Check console.');
      // ➤ FIX: Log the full error object to see details
      console.error(
        '❌ Upload Failed Details:',
        JSON.stringify(error, null, 2)
      );

      // Show specific message if available
      const msg = error?.error?.message || error?.message || 'Upload failed';
      this.showToast(`Error: ${msg}`);
    } finally {
      this.isUploading = false;
    }
  }

  // important feature
  // --- 1. CALL ACTION ---
  makeCall(mobile: string) {
    window.open(`tel:${mobile}`, '_system');
  }

  // --- 2. WHATSAPP ACTION ---
  openWhatsApp(mobile: string) {
    // Formatting for India (+91)
    let number = mobile.replace(/[^\d]/g, '');
    if (number.length === 10) number = '91' + number;

    window.open(`https://wa.me/${number}`, '_system');
  }

  // --- 3. PAY ACTION (UPI Intent) ---
  onPay(contact: Contact) {
    // This opens any installed UPI app (GPay, PhonePe, Paytm)
    const upiLink = `upi://pay?pa=${contact.mobile}@upi&pn=${encodeURIComponent(
      contact.fullName
    )}&cu=INR`;
    window.open(upiLink, '_system');

    // Fallback message
    this.showToast(`Opening payment for ${contact.fullName}...`);
  }

  // --- 4. SHARE ACTION ---
  async shareContact(contact: Contact) {
    try {
      await Share.share({
        title: 'Contact Details',
        text: `Name: ${contact.fullName}\nMobile: ${contact.mobile}`,
        dialogTitle: 'Share Contact',
      });
    } catch (error) {
      console.error('Share failed', error);
    }
  }

  // --- 5. DELETE ACTION ---
  onDelete(contact: Contact) {
    if (!contact.id) return;

    if (confirm(`Delete ${contact.fullName}?`)) {
      this.api.deleteContact(contact.id).subscribe({
        next: () => {
          this.showToast('Contact deleted');
          this.loadContacts(); // Refresh list
        },
        error: (err) => {
          console.error(err);
          this.showToast('Failed to delete');
        },
      });
    }
  }

  // ➤ SEARCH LOGIC
  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      // If empty, show everything
      this.filteredContacts = [...this.contacts];
    } else {
      // Filter by Name OR Mobile
      this.filteredContacts = this.contacts.filter(
        (contact) =>
          contact.fullName.toLowerCase().includes(term) ||
          contact.mobile.includes(term)
      );
    }
  }

  // ➤ TOGGLE FORM VISIBILITY
  toggleAddForm() {
    this.isAddingContact = !this.isAddingContact;
    // Reset form when closing
    if (!this.isAddingContact) {
      this.newContact = { fullName: '', mobile: '' };
    }
  }

  // ➤ SAVE CONTACT
  saveContact() {
    if (!this.newContact.fullName || this.newContact.mobile.length < 10) {
      this.showToast('Please enter valid details');
      return;
    }

    this.isLoading = true;
    this.api.addContact(this.newContact).subscribe({
      next: () => {
        this.showToast('Contact Saved!');
        this.isAddingContact = false; // Close form
        this.newContact = { fullName: '', mobile: '' }; // Reset
        // this.loadContacts();
        // Refresh list
        // 🔥 Trigger reactive refresh
        this.refreshContacts$.next();
      },
      error: (err) => {
        console.error(err);
        this.showToast('Failed to save');
        this.isLoading = false;
      },
    });
  }

  // Clear search button logic
  clearSearch() {
    if (!this.searchControl.value) return;
    if (this.searchControl.value) {
      this.searchControl.setValue('');
      this.searchControl.markAsPristine();
      this.searchControl.markAsUntouched();
    }
  }
  showToast(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }
}
