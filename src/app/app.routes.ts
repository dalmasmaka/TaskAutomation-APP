import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/components/auth.components';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';
import { MainLayoutComponent } from './core/layout/mainlayout/mainlayout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CompanyComponent } from './features/company/company.component';
import { UserInfoComponent } from './features/user/user-info.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { PullRequestsComponent } from './features/pull-requests/pull-requests.component';
import { HomeComponent } from './core/layout/home/home.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { IntegrationCallbackComponent } from './features/projects/forms/configuration/integration.component';
import { StaffComponent } from './features/staff/staff.component';
import { TeamsComponent } from './features/teams/teams.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'auth', component: AuthComponent },

  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: 'dashboard',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // /dashboard
      { path: '', component: DashboardComponent },

      // /dashboard/company
      {
        path: 'company',
        component: CompanyComponent,
        canActivate: [roleGuard],
        data: { role: 'Owner' }
      },

      // /dashboard/staff
      { path: 'staff', component: StaffComponent },
      // /dashboard/team
      { path: 'teams', component: TeamsComponent },

      // /dashboard/integration/callback
      { path: 'integration/callback', component: IntegrationCallbackComponent },

      // /dashboard/projects
      { path: 'projects', component: ProjectsComponent },

      // /dashboard/tasks
      { path: 'tasks', component: TasksComponent },

      // /dashboard/profile
      { path: 'profile', component: UserInfoComponent },

      // /dashboard/pull-requests
      { path: 'pull-requests', component: PullRequestsComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];