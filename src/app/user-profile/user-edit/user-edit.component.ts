import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../../common/common.functions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment.development';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrl: './user-edit.component.css',
    providers: [Commons]
})

export class UserEditComponent implements OnInit {

    username = '';
    email = '';
    password = '';
    dropdown = '';
    age: number = 0;
    isSubmitted = false; //for loading component
    isButtonDisabled = true;
    responseMessage: any = '';
    editForm: FormGroup;
    useId: any;

    private url = `${environment.apiUrl}/auth/update/user/details`;
    private urlDefVal = `${environment.apiUrl}/auth/profile/self`;

    constructor(private common: Commons, private router: Router, private apiservice: ApiService) { }

    ngOnInit(){
        // Initialize editForm with default values
        this.editForm = new FormGroup({
            'username': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'first_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'last_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'date_of_birth': new FormControl(null, Validators.required, this.ageLimit.bind(this)),
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl('********', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            'role': new FormControl(null, [Validators.required]),
            'gender': new FormControl(null, Validators.required),
            'age': new FormControl(this.age),
        });
        this.apiservice.getData<any>(this.urlDefVal).subscribe(
            response => {
                const dateObject = new Date(response.data.user_details[0].date_of_birth);
                const formattedDate = dateObject.toISOString().slice(0, 10);
                this.useId = response.data.id;
                this.editForm.patchValue({
                    'username': response.data.username,
                    'first_name': response.data.user_details[0].first_name,
                    'last_name': response.data.user_details[0].last_name,
                    'date_of_birth': formattedDate,
                    'email': response.data.user_details[0].email,
                    'role': response.data.roles[0].role,
                    'gender': response.data.user_details[0].gender,
                });
            }
        )

    }

    onInputChange(event: any){
        //important to timeout. The select dropdown has delay in it.
        setTimeout(() => {
            if (this.editForm.valid) {
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
        if (this.editForm.valid) {
            this.editForm.patchValue({ age: this.age });
            this.responseMessage = '';
            this.isSubmitted = true;
            const req = this.editForm.value;
            this.apiservice.putData<any>(this.url, req).subscribe(
                response => {
                    this.router.navigate(['/profile/' + this.useId]);
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
