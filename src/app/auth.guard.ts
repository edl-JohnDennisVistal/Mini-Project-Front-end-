import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private authservice: AuthService) {}

    canActivate(): Observable<boolean> {
        return this.authservice.isloggedIn$.pipe(
            map((data) => {
                if(data) {
                    return true; 
                } 
                else {
                    return false; 
                }
            })
        );
    }

}
