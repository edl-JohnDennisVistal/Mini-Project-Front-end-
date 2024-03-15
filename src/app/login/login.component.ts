import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Commons } from '../common/common.functions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    providers: [LoginService, Commons],
})

export class LoginComponent implements OnInit {

    username: string = "";
    password: string = "";
    responseMessage: any = "";
    isSubmitted: boolean = false;
    loginForm: FormGroup;
    isButtonDisabled: boolean = true;

    constructor(private loginService: LoginService, private common: Commons, private router: Router) { }

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
            this.loginService.logIn(this.loginForm.value).subscribe(
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

}
