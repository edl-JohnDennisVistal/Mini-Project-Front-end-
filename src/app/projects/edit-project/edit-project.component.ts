import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environment.development';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.component.html',
    styleUrl: './edit-project.component.css'
})

export class EditProjectComponent implements OnInit {

    projectForm: FormGroup;
    dataSource: any;
    displayedColumns = ['id', 'member'];
    project_name: string;
    start_date: string;
    end_date: string;
    description: string;

    constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
        this.project_name = this.route.snapshot.queryParams['project'];
        this.start_date = this.route.snapshot.queryParams['start'];
        this.end_date = this.route.snapshot.queryParams['end'];
        this.description = this.route.snapshot.queryParams['description'];
    }

    ngOnInit(): void {
        const start_date = this.start_date;
        const end_date = this.end_date;
        const dateObject1 = new Date(start_date);
        const dateObject2 = new Date(end_date);
        const formattedDate1 = dateObject1.toISOString().slice(0, 10);
        const formattedDate2 = dateObject2.toISOString().slice(0, 10);
        this.projectForm = new FormGroup({
            'id': new FormControl(this.route.snapshot.queryParams['id'], [Validators.required]),
            'project_name': new FormControl(this.project_name, [Validators.required]),
            'start_date': new FormControl(formattedDate1, [Validators.required]),
            'end_date': new FormControl(formattedDate2, [Validators.required]),
            'description': new FormControl(this.description, [Validators.required]),
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
        const url = `${environment.apiUrl}/auth/edit/project`;
        this.http.put<any>(url, req).subscribe(data => {
            if(data.response) {
                this.router.navigate(['/projects']);
            }
        })
    }

}
