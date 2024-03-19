import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ProjectsComponent } from './projects/projects.component';
import { AddProjectComponent } from './projects/add-project/add-project.component';
import { ProjectViewComponent } from './projects/project-view/project-view.component';
import { EditProjectComponent } from './projects/edit-project/edit-project.component';
import { UserEditComponent } from './user-profile/user-edit/user-edit.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'profile/edit', component: UserEditComponent, canActivate: [AuthGuard] },
    { path: 'profile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'admin/panel', component: AdminPanelComponent, canActivate: [AuthGuard] },
    { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: 'projects/add', component: AddProjectComponent, canActivate: [AuthGuard] },
    { path: 'projects/view', component: ProjectViewComponent, canActivate: [AuthGuard] },
    { path: 'projects/edit', component: EditProjectComponent, canActivate: [AuthGuard] },
    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { 

}
