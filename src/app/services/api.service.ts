// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contact {
  id?: number; // Optional because API might not return it instantly on create
  fullName: string;
  mobile: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://mobile.devapihub.cloud/mac/api/contacts';

  constructor(private http: HttpClient) {}

  // POST: Create Single Contact
  addContact(contact: Contact): Observable<any> {
    return this.http.post(this.baseUrl, contact);
  }

  // GET: List Contacts
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  // POST: Bulk Create
  // Matches the structure: { "contacts": [...] }
  bulkCreate(contacts: Contact[]): Observable<any> {
    const payload = { contacts: contacts };
    return this.http.post(`${this.baseUrl}/bulk`, payload);
  }
  // DELETE: Remove a contact
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
