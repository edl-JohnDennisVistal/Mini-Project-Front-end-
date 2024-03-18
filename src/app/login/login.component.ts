import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environment.development';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [Commons],
})

export class LoginComponent implements OnInit {

    username: string = "";
    password: string = "";
    responseMessage: any = "";
    isSubmitted: boolean = false;
    loginForm: FormGroup;
    isButtonDisabled: boolean = true;

    constructor(private common: Commons, private router: Router, private http: HttpClient) { }

    ngOnInit(): void { 
        /* needed to be initialized first before the component */
        this.loginForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
        })
    }
    /* Checks every input. If valid, button is enabled. */
    onInputChange(event: any){
        if(event.target.id == "username"){
            this.username = event.target.value;
        }
        else if(event.target.id == "password"){
            this.password = event.target.value;
        }
        if(this.loginForm.valid){
            this.isButtonDisabled = false;
        }
        else{
            this.isButtonDisabled = true;
        }
    }

    onSubmit() {
        if(this.loginForm.valid){
            this.isSubmitted = true;
            this.responseMessage = "";
            this.logIn(this.loginForm.value).subscribe(
                response => {
                    this.isSubmitted = false;
                    localStorage.setItem('access_token', response.access_token.token);
                    localStorage.setItem('user_id', response.access_token.user.id);
                    this.router.navigate(['/profile/' + response.access_token.user.id]);
                },
                error => {
                    console.error('Error during registration:', error);
                    this.isSubmitted = false;
                    if (error) {
                        this.responseMessage = error;
                    }
                }
            );
        }
    }

    logIn(req: FormData): Observable<any> {
        const url = `${environment.apiUrl}/auth/login`;
        return this.http.post<any>(url, req).pipe(
            map(response => {
                return response;
            }),
            catchError(this.handleErrors)
        );
    }

    private handleErrors(error: HttpErrorResponse): Observable<any> {
        if (error.status === 422) {
            const validationErrors = error.error.errors;
            return throwError(validationErrors);
        } 
        else if (error.status === 401) {
            const validationErrors = error.error;
            return throwError(validationErrors);
        }
        else {
            console.error('Unexpected Error:', error);
        }

        return throwError('Something went wrong. Please try again.');
    }

}
