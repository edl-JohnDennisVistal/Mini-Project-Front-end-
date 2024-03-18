import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LoadingComponent } from './loading/loading.component';
import { MatSortModule } from '@angular/material/sort';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { UserEditComponent } from './user-profile/user-edit/user-edit.component';

@NgModule({
    declarations: [
        AppComponent,
        RegistrationComponent,
        LoginComponent,
        UserProfileComponent,
        AdminPanelComponent,
        LoadingComponent,
        ProjectsComponent,
        AddProjectComponent,
        ProjectViewComponent,
        EditProjectComponent,
        UserEditComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatTableModule,
        MatIconModule,
        MatSortModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
    ],
    providers: [
        provideAnimationsAsync(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    ],
    bootstrap: [AppComponent]
})

export class AppModule { 
  
}
