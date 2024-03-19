import { Component, DoCheck, Injectable, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthService } from './auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [Injectable],
})

export class AppComponent implements OnInit, DoCheck {

    isLoggedIn: boolean = false;
    isAdminLogIn: boolean = false;
    id: string;
    
    constructor(private apiservice: ApiService, private authservice: AuthService) {
        this.id = localStorage.getItem('user_id');
        this.isLoggedIn = this.authservice.isLoggedIn;
        this.isAdminLogIn = this.authservice.isAdminLogIn;
    }

    ngOnInit(): void {  

    }

    logout() {
        this.authservice.logout();
    }

    ngDoCheck() {
        this.isLoggedIn = this.authservice.isLoggedIn;
        this.isAdminLogIn = this.authservice.isAdminLogIn;
    }
 
}
