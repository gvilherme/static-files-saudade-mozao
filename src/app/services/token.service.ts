import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = 'https://seu-backend-url.com/api';  // Substitua pela URL do seu backend

  constructor(private http: HttpClient) { }

  createQr(amount: number): Observable<any> {
    const body = { amount };
    return this.http.post(`${this.apiUrl}/tokens`, body);
  }

  checkPaymentStatus(tokenId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/${tokenId}/status`);
  }
}