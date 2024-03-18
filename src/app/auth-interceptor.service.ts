import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpHandler,HttpRequest } from '@angular/common/http';
import { environment } from '../../environment.development';

@Injectable()

export class AuthInterceptorService implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        /* excluded api's */
        if(request.url === `${environment.apiUrl}/auth/register`){
            return next.handle(request);
        }
        /* modefy request headers */
        const modifiedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                'content-type': 'application/json',
            },
        });
        /* resends the request */
        return next.handle(modifiedRequest);
    }
}
