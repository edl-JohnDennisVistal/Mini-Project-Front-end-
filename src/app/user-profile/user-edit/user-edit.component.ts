import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../../common/common.functions';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../../environment.development';

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

    constructor(private common: Commons, private router: Router, private http: HttpClient) { }

    ngOnInit(){
        const url = `${environment.apiUrl}/auth/profile/self`;
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
        this.http.get<any>(url).subscribe(data => {
            const dateObject = new Date(data.data.user_details[0].date_of_birth);
            const formattedDate = dateObject.toISOString().slice(0, 10);
            this.editForm.patchValue({
                'username': data.data.username,
                'first_name': data.data.user_details[0].first_name,
                'last_name': data.data.user_details[0].last_name,
                'date_of_birth': formattedDate,
                'email': data.data.user_details[0].email,
                'role': data.data.roles[0].role,
                'gender': data.data.user_details[0].gender,
            });
        });

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
            this.registerUser(this.editForm.value).subscribe(
                response => {
                    this.responseMessage = response;
                    this.router.navigate(['/profile/' + localStorage.getItem('user_id')]);
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

    registerUser(req: FormData): Observable<any> {
        const url = `${environment.apiUrl}/auth/update/user/details`;
        return this.http.put<any>(url, req).pipe(
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
        } else {
            console.error('Unexpected Error:', error);
        }

        return throwError('Something went wrong. Please try again.');
    }


}
