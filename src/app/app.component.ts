import { Component, Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environment.development';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [Injectable],
})

export class AppComponent implements OnInit {

    id: any;
    isLoggedIn: boolean = false;
    isManager: boolean = false;

    private url = `${environment.apiUrl}/auth/logout`;

    constructor(private authservice: AuthService) {}

    ngOnInit(): void {  
        this.authservice.isloggedIn$.subscribe(
            (data) => {
                this.isLoggedIn = data;
            }
        )
        this.authservice.user$.subscribe(
            (data) => {
                this.id = data?.id;
            }
        )
        this.authservice.manager$.subscribe(
            (data) => {
                this.isManager = data;
            }
        )
    }

    logout() {
        this.authservice.logout(this.url);
    }
 
}
