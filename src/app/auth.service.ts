import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '../../environment.development';

@Injectable()

export class AuthService {

    private isLoggedIn = new BehaviorSubject<boolean>(false);
    private user = new BehaviorSubject<any>(null);
    private manager = new BehaviorSubject<boolean>(false);
    private admin = new BehaviorSubject<boolean>(false);
    isloggedIn$ = this.isLoggedIn.asObservable();
    user$ = this.user.asObservable();
    manager$ = this.manager.asObservable();
    admin$ = this.admin.asObservable();

    private checkUrl = `${environment.apiUrl}/auth/check`

    constructor(private router: Router ,private apiservice: ApiService) {                
        if(localStorage.getItem('access_token')) {
            this.isLoggedIn.next(true);
        }
        this.authenticate();
    }

    login(url: string, req: any): Observable<boolean> {
        return this.apiservice.postData(url, req).pipe(
            map((data: any) => {
                this.isLoggedIn.next(true);
                localStorage.setItem('access_token', data.access_token.token);
                this.router.navigate(['/home']);
                this.user.next(data.access_token.user);
                if(data.access_token.user.role == 'ROLE_SUPERVISOR'){
                    this.manager.next(true);
                }
                else if(data.access_token.user.role == 'ROLE_ADMIN'){
                    this.manager.next(true);
                    this.admin.next(true);
                }
                return true;
            }),
            catchError(error => {
                return throwError(error); 
            })
        );
    }

    logout(url: string): void {
        this.apiservice.getData(url).subscribe(data => {
            if(data){
                localStorage.removeItem('access_token');
                this.isLoggedIn.next(false);
                this.router.navigate(['/login']);
            }
        })
    }

    authenticate(){
        this.apiservice.getData<any>(this.checkUrl).subscribe(data => {
            if(data){
                this.user.next(data.access_token.user);
                if(data.access_token.user.role == 'ROLE_SUPERVISOR'){
                    this.manager.next(true);
                }
                else if(data.access_token.user.role == 'ROLE_ADMIN'){
                    this.manager.next(true);
                    this.admin.next(true);
                }
            }
        })
    }

}
