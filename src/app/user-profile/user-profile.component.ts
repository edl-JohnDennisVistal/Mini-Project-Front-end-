import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environment.development';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../common/common.functions';
import { ActivatedRoute } from '@angular/router';

export interface UserData {
    id: number;
    name: string;
    email: string;
}

const EXAMPLE_DATA: UserData[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    // Add more data as needed
];

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css',
    providers: [Commons]
})

export class UserProfileComponent implements OnInit {

    isEdit: boolean = false;
    displayedColumns: string[] = ['id', 'name', 'email'];
    dataSource = EXAMPLE_DATA;
    editUserForm: FormGroup;
    first_name: string = '';
    last_name: string = '';
    age: number = null;
    gender: string = '';
    created_at: string = '';
    updated_at: string = '';
    date_of_birth: string = '';
    role: string = '';
    id: number;

    constructor(private http: HttpClient, private common: Commons, private route: ActivatedRoute) { }

    ngOnInit(){
        this.id = this.route.snapshot.params['id'];
        const url = `${environment.apiUrl}/auth/user/details/${this.id}`;
        this.http.get<any>(url).subscribe(data => {
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
        this.editUserForm = new FormGroup({
            'first_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'last_name': new FormControl(null, [Validators.required, this.common.noSpecialChars]),
            'age': new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)]),
            'gender': new FormControl(null, Validators.required),
        })
    }

    onSubmit(){
        this.isEdit = false;
    }

    onEdit(){            
        this.isEdit = true;
    }

    onCancel(){
        this.isEdit = false;
    }

}
