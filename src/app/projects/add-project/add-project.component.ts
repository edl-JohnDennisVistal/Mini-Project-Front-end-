import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from '../../../../environment.development';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-project',
    templateUrl: './add-project.component.html',
    styleUrl: './add-project.component.css'
})

export class AddProjectComponent implements OnInit {

    projectForm: FormGroup;

    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        this.projectForm = new FormGroup({
            'project_name': new FormControl(null, [Validators.required]),
            'start_date': new FormControl(null, [Validators.required]),
            'end_date': new FormControl(null, [Validators.required]),
            'description': new FormControl(null, [Validators.required]),
        })
        this.projectForm.get('end_date').setValidators(this.positiveDeadlineStart());
        this.projectForm.get('start_date').setValidators(this.positiveDeadlineEnd());
    }

    positiveDeadlineStart(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const startDate = this.projectForm.get('start_date').value as Date;
            const deadline = control.value as Date;
            if(!deadline){
                return { 'required': true };
            }
            if (deadline < startDate) {
                return { 'end_deadline': true };
            }
            return null;
        };
    }

    positiveDeadlineEnd(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const deadline = this.projectForm.get('end_date').value as Date;
            const startDate = control.value as Date;
            if (deadline < startDate) {
                return { 'start_date': true };
            }
            return null;
        };
    }

    onSubmit() {
        const req = this.projectForm.value;
        req.user_id = localStorage.getItem('user_id');
        const url = `${environment.apiUrl}/auth/add/project`;
        this.http.post<any>(url, req).subscribe(data => {
            if(data.response) {
                this.router.navigate(['/projects']);
            }
        })
    }

}
