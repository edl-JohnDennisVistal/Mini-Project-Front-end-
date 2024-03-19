import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { Router } from '@angular/router';
import { environment } from '../../../environment.development';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css',
    providers: [Commons]
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
    
    private url = `${environment.apiUrl}/auth/register`;

    constructor(private common: Commons, private router: Router, private apiservice: ApiService) { }

    ngOnInit(){
        this.registrationForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, this.common.noSpecialChars, this.noSpacesValidator().bind(this)]),
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
            const req = this.registrationForm.value;
            this.apiservice.postData<any>(this.url, req).subscribe(
                response => {
                    this.router.navigate(['/login']);
                },
                (error: HttpErrorResponse) => {
                    this.isSubmitted = false;
                    this.responseMessage = error;
                } 
            );
        }
    }

    noSpacesValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value && control.value.includes(' ')) {
                return { 'noSpaces': true };
            }
            return null; 
        };
    }    

}
