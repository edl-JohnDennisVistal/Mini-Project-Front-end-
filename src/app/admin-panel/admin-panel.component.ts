import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

export interface UserData {
    id: number;
    name: string;
    projects: number;
}

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrl: './admin-panel.component.css'
})

export class AdminPanelComponent implements OnInit {

    displayedColumns: string[] = ['id', 'users', 'role', 'number of tasks', 'actions'];
    dataSource: any;
    rawData: any;
    dropdownOpen = false;
    id: string;
    isDeleting: boolean = false;
    userId: string;                                //this is for loading delete button

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData() {
        this.id = localStorage.getItem('user_id');
        const url = `${environment.apiUrl}/auth/admin-panel/${this.id}`;
        this.http.get<any>(url).subscribe(data => {
            this.rawData = data.data;
            this.dataSource = new MatTableDataSource<UserData>(this.rawData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.isDeleting = false;
        })
    }

    /** 
     *  Admin panel actions. Delete user only fo admins.
    **/
    deleteUser(id: string) {
        this.isDeleting = true;
        this.userId = id;
        this.http.get<any>(`${environment.apiUrl}/auth/admin-panel/delete/${id}`).subscribe(
            (response) => {
                this.fetchData();
            },
            (error) => {
                console.error('Error deleting user:', error);
            }
        )
    }
    /** 
     *  Searching
    **/
    onSearch(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
