import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../services/registration.service';
import { Commons } from '../common/common.functions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css',
    providers: [RegistrationService, Commons]
})

export class RegistrationComponent implements OnInit {

    username = '';
    email = '';
    password = '';
    dropdown = '';
    age: number = 0;
    isSubmitted = false; //for loading component
    isButtonDisabled = true;
    responseMessage: any = '';
    registrationForm: FormGroup;

    constructor(private registrationService: RegistrationService, private common: Commons, private router: Router) { }

    ngOnInit(){
        this.registrationForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'first_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'last_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'date_of_birth': new FormControl(null, Validators.required, this.ageLimit.bind(this)),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            'role': new FormControl(null, [Validators.required]),
            'gender': new FormControl(null, Validators.required),
            'age': new FormControl(this.age),
        });
        
    }

    onInputChange(event: any){
        //important to timeout. The select dropdown has delay in it.
        setTimeout(() => {
            if (this.registrationForm.valid) {
                this.isButtonDisabled = false;
            } else {
                this.isButtonDisabled = true;
            }
        }, 0);
    }

    async ageLimit(control: any): Promise<{[s: string]: boolean}> {
        let today = new Date();
        let birthDate = new Date(control.value);
        let age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        this.age = age;
        return age < 18 ? { 'ageLimit': true } : null;
    }
    
    onSubmit() {
        if (this.registrationForm.valid) {
            this.registrationForm.patchValue({ age: this.age });
            this.responseMessage = '';
            this.isSubmitted = true;
            this.registrationService.registerUser(this.registrationForm.value).subscribe(
                response => {
                    this.responseMessage = response;
                    this.router.navigate(['/login']);
                },
                error => {
                    console.error('Error during registration:', error);
                    if (error) {
                        this.responseMessage = error;
                        this.isSubmitted = false;
                    }
                }
            );
        }
    }
      
}
