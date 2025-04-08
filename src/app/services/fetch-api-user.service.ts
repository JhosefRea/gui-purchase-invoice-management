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
export class FetchApiUserService {
  constructor(private http: HttpClient) {}

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: 'Bearer ' + token,
    });
  }

  public getAllUsers(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public createUser(userData: any): Observable<any> {
    return this.http
      .post(apiUrl + 'users', userData, { headers: this.getHeaders() })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public deleteUser(id: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${id}`, {
        headers: this.getHeaders(),
        responseType: 'text',
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  public updateUser(userId: string, userData: any): Observable<any> {
    console.log(
      '--------------putUser SERVICE------------------------------',
      userData
    );
    return this.http
      .put(apiUrl + `users/${userId}`, userData, {
        headers: this.getHeaders(),
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
