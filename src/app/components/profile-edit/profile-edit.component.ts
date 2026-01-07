import { Component, OnInit } from '@angular/core';
import { MaterialConfigModule } from '../../primeconfig/materialconfig.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DatabaseService } from '../../services/database.service';
import { Share } from '@capacitor/share';

// Define the interface for a Contact
interface Contact {
  id: number;
  fullName: string;
  mobile: string;
}

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [MaterialConfigModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css',
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  // Temporary Storage (Later replace with SQLite)
  contacts: Contact[] = [];
  searchTerm: string = ''; // <--- 1. Variable for search input

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private dbService: DatabaseService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      // Regex for 10-digit mobile number
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  // <--- 2. Getter to filter contacts automatically
  get filteredContacts() {
    if (!this.searchTerm) {
      return this.contacts;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    return this.contacts.filter(
      (c) =>
        c.fullName.toLowerCase().includes(lowerTerm) ||
        c.mobile.includes(lowerTerm)
    );
  }

  async ngOnInit() {
    // Load contacts when page opens
    console.log('🚀 [App] Component Init Started');
    try {
      // 1. Wait for DB to be ready
      await this.dbService.initializeDB();
      console.log('✅ [App] Database Service is Ready');

      // 2. NOW fetch the records
      await this.loadContacts();
    } catch (e) {
      console.error('❌ [App] Error during startup:', e);
    }
  }

  async loadContacts() {
    try {
      this.contacts = await this.dbService.getContacts();
    } catch (e) {
      console.error('Error loading contacts', e);
    }
  }

  onSavev1() {
    if (this.profileForm.valid) {
      // 1. Create new contact object
      const newContact: Contact = {
        id: Date.now(), // Unique ID
        fullName: this.profileForm.value.fullName,
        mobile: this.profileForm.value.mobile,
      };

      // 2. Add to start of array
      this.contacts.unshift(newContact);

      // 3. Reset form
      this.profileForm.reset();
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  async onSave() {
    if (this.profileForm.valid) {
      const { fullName, mobile } = this.profileForm.value;

      // Save to SQLite
      try {
        this.contacts = await this.dbService.addContact(fullName, mobile);
        this.profileForm.reset();
      } catch (e) {
        console.error('Error saving contact', e);
      }
    } else {
      this.profileForm.markAllAsTouched();
    }
  }
  // --- NEW DELETE METHOD ---
  async onDelete(contact: Contact) {
    const confirmDelete = confirm(`Delete ${contact.fullName}?`);

    if (confirmDelete) {
      // 1. Delete from DB
      this.contacts = await this.dbService.deleteContact(contact.id);
    }
  }
  // onDiscard() {
  //   this.location.back();
  // }

  onDiscard() {
    this.profileForm.reset();
    this.location.back(); // Go back to previous page
  }
  // --- ACTIONS ---

  openWhatsApp(mobile: string) {
    // Opens WhatsApp with the number
    window.open(`https://wa.me/91${mobile}`, '_blank');
  }

  makeCall(mobile: string) {
    // Triggers native phone dialer
    window.open(`tel:${mobile}`, '_self');
  }

  async shareContact(contact: Contact) {
    // if (navigator.share) {
    //   navigator
    //     .share({
    //       title: contact.fullName,
    //       text: `Check out this contact: ${contact.fullName} - ${contact.mobile}`,
    //       url: '',
    //     })
    //     .catch((err) => console.error('Error sharing', err));
    // } else {
    //   alert('Sharing is not supported on this browser.');
    // }
    try {
      // Capacitor Share Method
      await Share.share({
        title: 'Share Contact',
        text: `Here is the contact details:\nName: ${contact.fullName}\nMobile: +91 ${contact.mobile}`,
        dialogTitle: 'Share Contact', // Title of the popup on Android
      });
    } catch (error) {
      console.error('❌ Error sharing contact:', error);
    }
  }
  // --- NEW PAY FUNCTION ---
  onPay(contact: Contact) {
    // 1. Construct the UPI URI
    // Note: Since we only have a mobile number, we are guessing the VPA.
    // '@ybl' is common for PhonePe. You can change this or leave it empty
    // to let the user fill it in the app if the app supports it.
    const vpa = `${contact.mobile}@ybl`;
    const name = encodeURIComponent(contact.fullName);

    // 2. Create the deep link
    // pa = Payee Address (VPA)
    // pn = Payee Name
    // cu = Currency (INR)
    const upiUrl = `upi://pay?pa=${vpa}&pn=${name}&cu=INR`;

    // 3. Open system intent
    // '_system' forces it to open outside the app (in PhonePe/GPay)
    window.open(upiUrl, '_system');
  }
}
