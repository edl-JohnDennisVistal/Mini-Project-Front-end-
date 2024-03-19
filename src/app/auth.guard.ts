import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()

export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authservice: AuthService ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {        
        if(this.authservice.isLoggedIn) {
            return true;
        } 
        else {
            this.router.navigate(['/login']);
            return false;
        }
    }

}