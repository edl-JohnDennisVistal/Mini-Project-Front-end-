import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../auth.service';
import { environment } from '../../../environment.development';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

    name: string;
    id: number;

    private nameApi = `${environment.apiUrl}/auth/name`;

    constructor(private apiservice: ApiService, private authservice: AuthService) { }

    ngOnInit(): void {
        if(this.authservice.isLoggedIn){
            this.apiservice.getData<any>(this.nameApi).subscribe(
                response => {
                    this.id = response.id;
                    this.name = response.name;
                }
            )
        }
    }

}
