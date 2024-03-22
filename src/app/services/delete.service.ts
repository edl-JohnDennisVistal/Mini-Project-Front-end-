import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ 
    providedIn: "root" 
})

export class DeleteService extends ApiService {

    constructor(http: HttpClient) {
        super(http);
    }

    public customDeleteFunction<T>(url: any): Observable<T> {
        return this.deleteData<T>(url); 
    }

}
