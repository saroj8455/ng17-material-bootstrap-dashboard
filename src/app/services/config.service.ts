import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface MobileApiResponse {
  status: string;
  uptime: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private MOBILE_API = 'https://mobile.devapihub.cloud/api/health';
  constructor(private http: HttpClient) {}

  loadProductsFromFakeApi() {
    return this.http.get('https://fakestoreapi.com/products');
  }

  mobileConfig() {
    return this.http.get<MobileApiResponse>(this.MOBILE_API);
  }
}
