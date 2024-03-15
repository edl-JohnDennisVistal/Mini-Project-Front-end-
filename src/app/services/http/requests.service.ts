import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment.development';

export class RequestsService {
    
    constructor(private http: HttpClient) {}

    registerUser(data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/register`, data);
    }
    
}
