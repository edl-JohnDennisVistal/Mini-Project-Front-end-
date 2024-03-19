import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';

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
    userId: string;//this is for loading delete button. If not an owner of account cant delete.

    private urlAdminPanel = `${environment.apiUrl}/auth/admin/panel`;
    private urlDeleteUser = `${environment.apiUrl}/auth/admin/panel/delete/`;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 

    constructor(private apiservices: ApiService) { }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData() {
        this.apiservices.getData<any>(this.urlAdminPanel).subscribe(
            (response) => {
                this.rawData = response.data;
                this.dataSource = new MatTableDataSource<UserData>(this.rawData);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isDeleting = false;
            }
        )
    }

    /** 
     *  Admin panel actions. Delete user only fo admins.
    **/
    deleteUser(id: string) {
        this.isDeleting = true;
        this.userId = id;
        this.apiservices.deleteData<any>(this.urlDeleteUser + id).subscribe(
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
