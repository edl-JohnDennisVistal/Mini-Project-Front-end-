import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from '../admin-panel/admin-panel.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    providers: [Commons]
})

export class UserProfileComponent implements OnInit {

    isEdit: boolean = false;
    displayedColumns: string[] = ['id', 'name', 'email', 'start', 'end'];
    skillsForm: FormGroup;
    first_name: string = '';
    last_name: string = '';
    age: number = null;
    gender: string = '';
    created_at: string = '';
    updated_at: string = '';
    date_of_birth: string = '';
    role: string = '';
    id: number = this.route.snapshot.params['id'];
    user_id: number;
    rawData: any;
    dataSource: any;
    skills: string[] = [];
    userSkills: string[] = [];

    private url = `${environment.apiUrl}/auth/user/details/${this.id}`;
    private urlSkills = `${environment.apiUrl}/auth/skills/${this.id}`;
    private urlUserSkills = `${environment.apiUrl}/auth/user/skills/${this.id}`;
    private urlAddSkill = `${environment.apiUrl}/auth/skill/add`;
    private urlDeleteSkill = `${environment.apiUrl}/auth/skill/delete`;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 

    constructor(private apiservice: ApiService, private route: ActivatedRoute, private authservice: AuthService) {  }

    ngOnInit(){
        this.apiservice.getData<any>(this.url).subscribe(
            response => {
                this.rawData = response.userDetails.projects;
                this.dataSource = new MatTableDataSource<UserData>(this.rawData);
                this.dataSource.paginator = this.paginator;
                const create = new Date(response.userDetails.created_at);
                const update = new Date(response.userDetails.updated_at);
                const options = { month: 'long', day: 'numeric', year: 'numeric' } as any;
                const create_on = new Intl.DateTimeFormat('en-US', options).format(create);
                const updated_on = new Intl.DateTimeFormat('en-US', options).format(update);
                this.first_name = response.userDetails.user_details[0].first_name;
                this.last_name = response.userDetails.user_details[0].last_name;
                this.age = response.userDetails.user_details[0].age;
                this.gender = response.userDetails.user_details[0].gender;
                this.created_at = create_on;
                this.updated_at = updated_on;
                this.date_of_birth = response.userDetails.user_details[0].date_of_birth
                this.role = response.userDetails.roles[0].role
            }
        )
        this.getDefaultSkills();
        this.getUserSkills();
        this.skillsForm = new FormGroup({
            'skill': new FormControl(null, Validators.required),
        })
        this.authservice.user$.subscribe(
            (data) => {
                this.user_id = data?.id;
            }
        )
    }

    onSubmit(){
        this.isEdit = false;
    }

    onEdit(){            
        this.isEdit = true;
    }

    onAddSkill(){
        const skill = this.skillsForm.controls['skill'].value;  
        this.apiservice.postData<any>(this.urlAddSkill, { skill: skill }).subscribe(
            (response) => {
                this.getUserSkills();
                this.getDefaultSkills();
            }
        )
    }

    onDelete(id: number){
        this.apiservice.deleteData<any>(`${this.urlDeleteSkill}/${id}`).subscribe(
            (respose) => {
                this.getUserSkills();
                this.getDefaultSkills();
            }
        )
    }

    getDefaultSkills(){
        this.apiservice.getData<any>(this.urlSkills).subscribe(
            (response) => {
                this.skills = response.response;
            }
        )
    }

    getUserSkills(){
        this.apiservice.getData<any>(this.urlUserSkills).subscribe(
            (response) => {
                this.userSkills = response.response;
            }
        )
    }

}
