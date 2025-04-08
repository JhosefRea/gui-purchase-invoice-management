import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  // User registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  // User login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log('___________login________');
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get list of invoices
  public getAllInvoices(): Observable<any> {
    return this.http
      .get(apiUrl + 'einvoices/handler/', { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a single invoice by ID
  public getInvoiceById(id: string): Observable<any> {
    console.log(
      '--------------getInvoiceById SERVICE------------------------------',
      id
    );
    return this.http
      .get(apiUrl + `einvoices/handler/${id}`, { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Create a new invoice
  public createInvoice(invoiceData: any): Observable<any> {
    return this.http
      .post(apiUrl + 'invoiceswwNOSE USA', invoiceData, {
        headers: this.getHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public updateInvoice(invoiceId: string, invoiceData: any): Observable<any> {
    console.log(
      '--------------putInvoice SERVICE------------------------------',
      invoiceData
    );
    return this.http
      .put(apiUrl + `einvoices/${invoiceId}`, invoiceData, {
        headers: this.getHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Update an existing invoice
  public postInvoice(invoiceData: any): Observable<any> {
    console.log(
      '--------------postInvoice SERVICE------------------------------',
      invoiceData
    );
    return this.http
      .post(apiUrl + `einvoices/`, invoiceData, {
        headers: this.getHeaders(),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public markInvoiceAsPaid(id: string): Observable<any> {
    return this.http
      .patch(
        apiUrl + `invoices/${id}/mark-as-paid`,
        {},
        { headers: this.getHeaders() }
      )
      .pipe(
        catchError((error) => {
          console.error(
            `Error marking invoice as paid:`,
            error.message || error
          );
          return throwError(
            () => new Error('Failed to mark invoice as paid; please try again.')
          );
        })
      );
  }

  // Delete an invoice
  public deleteInvoice(id: string): Observable<any> {
    return this.http
      .delete(apiUrl + `invoices/${id}`, {
        headers: this.getHeaders(),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Error handling
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status: ${error.status}, ` +
          `Error Body: ${JSON.stringify(error.error)}`
      );
    }
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }

  // Extract response data
  private extractResponseData(res: any): any {
    return res || {};
  }
}
