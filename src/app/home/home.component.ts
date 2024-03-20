import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {

    name: string;
    id: any;

    constructor(private authservice: AuthService) { }

    ngOnInit(): void {
        this.authservice.user$.subscribe(
            (data) => {
                this.id = data?.id
            }
        )
    }

}
