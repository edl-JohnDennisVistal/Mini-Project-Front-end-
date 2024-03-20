import { Injectable } from "@angular/core";
import { BaseRequestService } from "./baserequest.services";
import { Observable, catchError, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({ 
    providedIn: "root" 
})

export class ApiService extends BaseRequestService {

    constructor(http: HttpClient) {
        super(http);
    }

    public getData<T>(url: string): Observable<T> {
        return this.get<T>(url);
    }

    public postData<T>(url: string, body: any): Observable<T> {
        return this.post<T>(url, body).pipe(
            catchError((error: HttpErrorResponse) => this.handleErrors(error))
        );
    }

    public putData<T>(url: string, body: any): Observable<T> {
        return this.put<T>(url, body);
    }

    public deleteData<T>(url: string): Observable<T> {
        return this.delete<T>(url);
    }

    private handleErrors(error: HttpErrorResponse): Observable<any> {
        if (error.status === 422) {
            const validationErrors = error.error.errors;
            return throwError(validationErrors);
        } else {
            console.error('Unexpected Error:', error);
        }
        return throwError(error.error.message);
    }

}
