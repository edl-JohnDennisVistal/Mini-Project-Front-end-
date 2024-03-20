import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { environment } from '../../../environment.development';

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

    private url = `${environment.apiUrl}/auth/login`

    constructor(private common: Commons, private authservice: AuthService) { }

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
            const req = this.loginForm.value;
            this.authservice.login(this.url, req).subscribe(
                (response) => {},
                (error: any) => {
                    this.responseMessage = error;
                    this.isSubmitted = false;
                }
            );
        }
    }

}
