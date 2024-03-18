import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from '../admin-panel/admin-panel.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    providers: [Commons]
})

export class UserProfileComponent implements OnInit {

    isEdit: boolean = false;
    displayedColumns: string[] = ['id', 'name', 'email'];
    skillsForm: FormGroup;
    first_name: string = '';
    last_name: string = '';
    age: number = null;
    gender: string = '';
    created_at: string = '';
    updated_at: string = '';
    date_of_birth: string = '';
    role: string = '';
    id: number;
    rawData: any;
    dataSource: any;
    skills: string[] = [];
    userSkills: string[] = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 

    constructor(private http: HttpClient, private common: Commons, private route: ActivatedRoute) { }

    ngOnInit(){
        this.id = this.route.snapshot.params['id'];
        const url = `${environment.apiUrl}/auth/user/details/${this.id}`;
        const urlSkills = `${environment.apiUrl}/auth/skills`;
        const urlUserSkills = `${environment.apiUrl}/auth/user/skills/${this.id}`;
        this.http.get<any>(url).subscribe(data => {
            this.rawData = data.projects;
            this.dataSource = new MatTableDataSource<UserData>(this.rawData);
            this.dataSource.paginator = this.paginator;
            const create = new Date(data.userDetails.created_at);
            const update = new Date(data.userDetails.updated_at);
            const options = { month: 'long', day: 'numeric', year: 'numeric' } as any;
            const create_on = new Intl.DateTimeFormat('en-US', options).format(create);
            const updated_on = new Intl.DateTimeFormat('en-US', options).format(update);
            this.first_name = data.userDetails.user_details[0].first_name;
            this.last_name = data.userDetails.user_details[0].last_name;
            this.age = data.userDetails.user_details[0].age;
            this.gender = data.userDetails.user_details[0].gender;
            this.created_at = create_on;
            this.updated_at = updated_on;
            this.date_of_birth = data.userDetails.user_details[0].date_of_birth
            this.role = data.userDetails.roles[0].role
        })
        this.http.get<any>(urlSkills).subscribe(data => {
            this.skills = data.response;
        })
        this.http.get<any>(urlUserSkills).subscribe(data => {
            this.userSkills = data.response;
        })
        this.skillsForm = new FormGroup({
            'skill': new FormControl(null, Validators.required),
        })
    }

    onSubmit(){
        this.isEdit = false;
    }

    onEdit(){            
        this.isEdit = true;
    }

    onAddSkill(){
        const skill = this.skillsForm.controls['skill'].value;  
        const url = `${environment.apiUrl}/auth/skill/add`;
        const urlSkills = `${environment.apiUrl}/auth/skills`;
        const urlUserSkills = `${environment.apiUrl}/auth/user/skills/${this.id}`;
        this.http.post<any>(url, { skill: skill }).subscribe(data => {
            this.http.get<any>(urlSkills).subscribe(data => {
                this.skills = data.response;
            })
            this.http.get<any>(urlUserSkills).subscribe(data => {
                this.userSkills = data.response;
            })
        })
    }

}
