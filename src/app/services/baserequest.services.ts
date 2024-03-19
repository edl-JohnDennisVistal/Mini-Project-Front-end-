import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";


export class BaseRequestService {

    constructor(protected http: HttpClient) {}

    protected get<T>(url: string): Observable<T> {
        const headers = this.getHeaders();
        return this.http.get<T>(url, { headers });
    }

    protected post<T>(url: string, body: any): Observable<T> {
        const headers = this.getHeaders();
        return this.http.post<T>(url, body, { headers });
    }

    protected put<T>(url: string, body: any): Observable<T> {
        const headers = this.getHeaders();
        return this.http.put<T>(url, body, { headers });
    }

    protected delete<T>(url: string): Observable<T> {
        const headers = this.getHeaders();
        return this.http.delete<T>(url, { headers });
    }

    private getHeaders(): HttpHeaders {
        const accessToken = localStorage.getItem('access_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        });
    }

}