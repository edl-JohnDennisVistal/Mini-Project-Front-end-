import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../admin-panel/admin-panel.component';
import { environment } from '../../../../environment.development';

@Component({
    selector: 'app-project-view',
    templateUrl: './project-view.component.html',
    styleUrl: './project-view.component.css'
})

export class ProjectViewComponent implements OnInit {

    dataSource: any;
    displayedColumns = ['id', 'member', 'actions']
    project_id: number;
    owner: string;
    start_date: string;
    end_date: string;
    project: string;
    users: string[];
    members: [];
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute, private http: HttpClient){}

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.project_id = params.id,
            this.owner = params.owner,
            this.start_date = params.start,
            this.end_date = params.end
            this.project = params.project
        })
        const urlPrjMem = `${environment.apiUrl}/auth/project/members/${this.project_id}`;
        this.http.get<any>(urlPrjMem).subscribe(data => {
            this.members = data.response[0].users;
        })
        const allUsers = `${environment.apiUrl}/auth/admin/panel`;
        this.http.get<any>(allUsers).subscribe(data => {
            this.dataSource = new MatTableDataSource<UserData>(data.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
    }

    onSearch(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onAdd(id: any) {
        const urlPrjMem = `${environment.apiUrl}/auth/project/members/add`;
        const req = {
            user_id: id, 
            project_id: this.project_id
        }
        this.http.post<any>(urlPrjMem, req).subscribe(data => {
            const urlPrjMem = `${environment.apiUrl}/auth/project/members/${this.project_id}`;
            this.http.get<any>(urlPrjMem).subscribe(data => {
                console.log(';xx')
                this.members = data.response[0].users;
            })
        })
    }

}
