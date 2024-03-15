import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'profile/:id', component: UserProfileComponent },
    { path: 'admin/:id', component: AdminPanelComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/add', component: AddProjectComponent },
    { path: 'projects/view/:id', component: ProjectViewComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { 

}
