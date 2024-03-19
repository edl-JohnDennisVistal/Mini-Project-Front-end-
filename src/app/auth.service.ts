import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { ApiService } from "./services/api.service";
import { environment } from "../../environment.development";
import { Router } from "@angular/router";


@Injectable()

export class AuthService {

    isLoggedIn: boolean = false;
    isAdminLogIn: boolean = false;

    private loginEndpoint = `${environment.apiUrl}/auth/login`;
    private urlAdmin = `${environment.apiUrl}/auth/check/admin`;
    private urlCheck = `${environment.apiUrl}/auth/status/checker`;
    private urlLogout = `${environment.apiUrl}/auth/logout`;

    constructor(private apiservice: ApiService, private router: Router) {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            this.isLoggedIn = true;
            this.isAdmin();
        }
    }

    login(req: any): Observable<any> {
        return this.apiservice.postData<any>(this.loginEndpoint, req).pipe(
            map((data: any) => {
                this.isLoggedIn = true; 
                this.isAdminLogIn = true;
                return data;
            }),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    logout() {
        this.apiservice.getData<any>(this.urlLogout).subscribe(
            data => {
                if (data.response) {
                    this.isLoggedIn = false;
                    this.isAdminLogIn = false;
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user_id');
                }
                this.router.navigate(['/login']);
            }
        )
    }

    isAdmin() {
        this.apiservice.getData<any>(this.urlAdmin).subscribe(
            response => {
                if (response.response) {
                    this.isAdminLogIn = true;
                }
            }
        )
    }
    

}