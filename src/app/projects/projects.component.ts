import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UserData } from '../admin-panel/admin-panel.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
})

export class ProjectsComponent implements OnInit {

    displayedColumns: string[] = ['id', 'user', 'project', 'start_date', 'end_date', 'actions'];
    dataSource: any;
    rawData: any;
    userId = localStorage.getItem('user_id');
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpClient, private router: Router) {  }

    ngOnInit(): void { 
        this.fetchData();
    }

    fetchData() {
        const url = `${environment.apiUrl}/auth/fetch/projects`;
        this.http.get<any>(url).subscribe(data => {
            this.rawData = data.response;
            this.dataSource = new MatTableDataSource<UserData>(this.rawData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
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
        const url = `${environment.apiUrl}/auth/project/delete/${id}`;
        this.http.delete<any>(url).subscribe(data => {
            console.log(data)
            this.fetchData();
        })
    }

}
