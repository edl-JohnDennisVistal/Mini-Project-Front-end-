import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from '../admin-panel/admin-panel.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
})

export class ProjectsComponent implements OnInit {

    displayedColumns: string[] = ['id', 'user', 'project', 'start_date', 'end_date', 'description', 'actions'];
    dataSource: any;
    rawData: any;
    userId = localStorage.getItem('user_id');

    private urlFetchProjects = `${environment.apiUrl}/auth/fetch/projects`;
    private urlProjectDelete = `${environment.apiUrl}/auth/project/delete/`;
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router, private apiservice: ApiService) {  }

    ngOnInit(): void { 
        this.fetchData();
    }

    fetchData() {
        this.apiservice.getData<any>(this.urlFetchProjects).subscribe(
            response => {
                this.rawData = response.response;
                this.dataSource = new MatTableDataSource<UserData>(this.rawData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        )
    }

    onSearch(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    onViewProject(id: number, owner: string, project: string, start: string, end: string){
        const queryParams = { id: id, owner: owner, project: project, start: start, end: end };
        this.router.navigate(['/projects/view/'], { queryParams });
    }

    onEditProject(id: number, owner: string, project: string, start: string, end: string, description: string){
        const queryParams = { id: id, owner: owner, project: project, start: start, end: end, description: description };
        this.router.navigate(['/projects/edit/'], { queryParams });
    }   

    deleteUser(id: number){
        this.apiservice.deleteData<any>(this.urlProjectDelete + id).subscribe(
            response => {
                this.fetchData();
            }
        )
    }

}
