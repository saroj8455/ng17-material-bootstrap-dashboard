import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Contact = {
  id: number;
  fullName: string;
  mobile: string;
  createdAt?: string;
};

@Injectable({ providedIn: 'root' })
export class ContactsApiService {
  // Use environment.ts for this
  // private baseUrl = 'http://localhost:8080/api/contacts';
  private baseUrl = 'http://192.168.31.86:8080/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts() {
    return firstValueFrom(this.http.get<Contact[]>(this.baseUrl));
  }

  async addContact(fullName: string, mobile: string) {
    const res = await firstValueFrom(
      this.http.post<{ insertedId: number; contacts: Contact[] }>(
        this.baseUrl,
        { fullName, mobile }
      )
    );
    return res.contacts;
  }
  bulkUpload(contacts: Contact[]) {
    return firstValueFrom(
      this.http.post<any>(`${this.baseUrl}/bulk`, { contacts })
    );
  }

  deleteContact(id: number) {
    return firstValueFrom(this.http.delete<Contact[]>(`${this.baseUrl}/${id}`));
  }
}
