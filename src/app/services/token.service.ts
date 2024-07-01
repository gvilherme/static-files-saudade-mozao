import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = 'https://gcsl1e6oee.execute-api.us-east-1.amazonaws.com/test/api';  // Substitua pela URL do seu backend

  constructor(private http: HttpClient) { }

  createToken(amount: string, gender: string, full_name:string, email:string): Observable<any> {
    const body = { amount, gender, full_name };
    return this.http.post(`${this.apiUrl}/depositar/${email}/pix`, body)
      .pipe(
        catchError(this.handleError)
      );
  }

  checkPaymentStatus(tokenId: string, email:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/depositar/${email}/pix/${tokenId}/status`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTokens(email: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/tokens?email=${email}`)
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}