import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { AuthComponent } from './features/auth/components/auth.components';
import { MainLayoutComponent } from './core/layout/mainlayout/mainlayout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CompanyComponent } from './features/company/company.component';
import { UserInfoComponent } from './features/user/user-info.component';
import { TeamComponent } from './features/team/team.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { IntegrationCallbackComponent } from './features/projects/forms/configuration/integration.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, },
      { path: 'company', component: CompanyComponent, canActivate: [roleGuard], data: { role: 'Owner' } },
      { path: 'team', component: TeamComponent },
      { path: 'integration/callback', component: IntegrationCallbackComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'profile', component: UserInfoComponent },
      
    ]
  },
  { path: '**', redirectTo: 'auth' }
];