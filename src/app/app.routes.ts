import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { AuthComponent } from './features/auth/components/auth.components';

export const routes: Routes = [
        { path: 'auth', component: AuthComponent },
//   { path: '', redirectTo: '/auth', pathMatch: 'full' },
//   { path: '**', redirectTo: '/auth' }
];
