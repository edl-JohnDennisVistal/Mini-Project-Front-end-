import { Component, Injectable } from '@angular/core';
import { LoginService } from './services/login.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    providers: [LoginService, Injectable],
})

export class AppComponent {
  
}
