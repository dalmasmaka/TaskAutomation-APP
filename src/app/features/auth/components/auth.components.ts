import { Component } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
@Component({
  selector: 'app-auth',
  templateUrl: './auth.components.html',
  styleUrls: ['./auth.components.css'],
  imports: [LoginComponent, RegisterComponent, CommonModule, MatCardModule, MatCardModule, ForgotPasswordComponent]
})

export class AuthComponent {
  mode: 'login' | 'register' | 'forgot' = 'login';

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
  }
}