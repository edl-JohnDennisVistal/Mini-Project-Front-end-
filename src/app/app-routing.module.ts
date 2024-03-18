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

const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },

    { path: 'profile/edit', component: UserEditComponent },
    { path: 'profile/:id', component: UserProfileComponent },

    { path: 'admin/panel', component: AdminPanelComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'projects/add', component: AddProjectComponent },
    { path: 'projects/view', component: ProjectViewComponent },
    { path: 'projects/edit', component: EditProjectComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { 

}
