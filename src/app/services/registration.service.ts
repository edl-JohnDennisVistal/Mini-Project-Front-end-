import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { takeUntil } from 'rxjs';

@Injectable()

export class RegistrationService {

    constructor(private http: HttpClient) { };

    registerUser(req: FormData): Observable<any> {
        const url = `${environment.apiUrl}/auth/register`;
        return this.http.post<any>(url, req).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleErrors)
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<any> {
        if (error.status === 422) {
            const validationErrors = error.error.errors;
            return throwError(validationErrors);
        } else {
            console.error('Unexpected Error:', error);
        }

        return throwError('Something went wrong. Please try again.');
    }

}