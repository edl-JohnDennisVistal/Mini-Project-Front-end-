import { environment  } from "../../../environment.development";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from "rxjs";
import { Injectable } from '@angular/core';
  
@Injectable()

export class LoginService {

    constructor(private http: HttpClient) { };
    /** 
     *  This method is used to log in. Expects a token in return.
    **/
    logIn(req: FormData): Observable<any> {
        const url = `${environment.apiUrl}/auth/login`;
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
        } 
        else if (error.status === 401) {
            const validationErrors = error.error;
            return throwError(validationErrors);
        }
        else {
            console.error('Unexpected Error:', error);
        }

        return throwError('Something went wrong. Please try again.');
    }

} 