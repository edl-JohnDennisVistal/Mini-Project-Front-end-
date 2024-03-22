import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environment.development';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth.service';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';

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
    isadmin: boolean;
    url: string;

    private urlAdminPanel = `${environment.apiUrl}/auth/admin/panel`;
    private urlDeleteUser = `${environment.apiUrl}/auth/admin/panel/delete/`;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort; 
    @ViewChild(DeleteModalComponent, { static: true }) deletemodalcomponent: DeleteModalComponent;

    constructor(private apiservices: ApiService, private authservice: AuthService) { }

    ngOnInit(): void {
        this.fetchData();
        this.authservice.admin$.subscribe(
            data => {
                this.isadmin = data;
            }
        )
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
        this.url = this.urlDeleteUser + id;
    }
    deleted(isDeleted: boolean) {
        this.isDeleting = isDeleted;
        this.fetchData();
    }
    /** 
     *  Searching
    **/
    onSearch(event: any) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
