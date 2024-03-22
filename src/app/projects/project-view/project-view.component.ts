import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../admin-panel/admin-panel.component';
import { environment } from '../../../../environment.development';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-project-view',
    templateUrl: './project-view.component.html',
    styleUrl: './project-view.component.css'
})

export class ProjectViewComponent implements OnInit {

    dataSource: any;
    displayedColumns = ['id', 'member', 'task', 'actions']
    project_id: number;
    owner: string;
    start_date: string;
    end_date: string;
    project: string;
    users: string[];
    members: [];
    isAdmin: boolean = false;
    discription: string = " ";
    url: string;
    isDeleting: boolean = false;

    private urlProjectMember = `${environment.apiUrl}/auth/project/members/`;
    private urlAllUsers = `${environment.apiUrl}/auth/admin/panel`;
    private urlProjectAddMember = `${environment.apiUrl}/auth/project/members/add`;
    private urlProjectDescription = `${environment.apiUrl}/auth/project/description/`;
    private urlDeleteMember = `${environment.apiUrl}/auth/project/members/delete/`;
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute, private apiservice: ApiService){}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.project_id = params.id,
            this.owner = params.owner,
            this.start_date = params.start,
            this.end_date = params.end
            this.project = params.project
        })
        this.getMembers();
        this.getDiscription();
    }

    onSearch(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onAdd(id: any) {
        const req = {
            user_id: id, 
            project_id: this.project_id
        }
        this.apiservice.postData(this.urlProjectAddMember, req).subscribe(
            data => {
                this.getMembers();
            }
        )
    }

    getMembers(){
        this.apiservice.getData<any>(this.urlProjectMember + this.project_id).subscribe(
            data => {
                this.members = data.response[0].users;
                this.getAllUsers();
            }
        )
    }

    getAllUsers(){
        this.apiservice.getData<any>(this.urlAllUsers).subscribe(
            data => {
                this.dataSource = new MatTableDataSource<UserData>(data.data);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        )
    }

    getDiscription() {
        this.apiservice.getData<any>(this.urlProjectDescription + this.project_id).subscribe(
            data => {
                this.discription = data;
            }
        )
    }
    onDelete(id: string) {
        this.isDeleting = true;
        this.url = this.urlDeleteMember + id;
    }
    deleted(isDeleted: boolean) {
        this.isDeleting = isDeleted;
        this.getMembers();
    }

}
