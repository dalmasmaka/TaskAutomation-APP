import { Component, OnInit, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// Material Imports
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from "../../../../core/services/auth.service";
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
    @ViewChild('stepper') stepper!: MatStepper;

    workspaceGroup: FormGroup;
    accountGroup: FormGroup;

    selectedRole = signal<string>('Owner');
    isInviteOnly = false;
    errorMessage = signal<string | null>(null);
    constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private zone: NgZone) {
        this.workspaceGroup = new FormGroup({
            role: new FormControl('Owner', Validators.required),
            workspaceName: new FormControl('', Validators.required),
            invitationCode: new FormControl('')
        });

        this.accountGroup = new FormGroup({
            fullName: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8)])
        });
    }

    ngOnInit() {
        const invite = this.route.snapshot.queryParamMap.get('invite');

        if (invite) {
            this.isInviteOnly = true;
            this.selectedRole.set('Invite');
            this.workspaceGroup.patchValue({ role: 'Invite', inviteCode: invite });
            this.updateValidation('Invite');
        }

        this.workspaceGroup.get('role')?.valueChanges.subscribe(role => {
            this.selectedRole.set(role);
            this.updateValidation(role);
        });
    }

    ngAfterViewInit() {
        if (this.isInviteOnly) {
            setTimeout(() => this.stepper.next(), 0);
        }
    }

    private updateValidation(role: string) {
        const inviteCtrl = this.workspaceGroup.get('inviteCode');
        const workspaceCtrl = this.workspaceGroup.get('workspaceName');

        if (role === 'Invite') {
            inviteCtrl?.setValidators([Validators.required]);
            workspaceCtrl?.clearValidators();
        } else {
            workspaceCtrl?.setValidators([Validators.required]);
            inviteCtrl?.clearValidators();
        }

        inviteCtrl?.updateValueAndValidity();
        workspaceCtrl?.updateValueAndValidity();
    }

    onRegister() {
        if (this.workspaceGroup.invalid || this.accountGroup.invalid) {
            this.workspaceGroup.markAllAsTouched();
            this.accountGroup.markAllAsTouched();
            return;
        }

        const finalData = {
            ...this.workspaceGroup.value,
            ...this.accountGroup.value
        };

        this.authService.register(finalData).subscribe({
            next: (res: any) => {
                if (res && res.success === false) {
                    this.zone.run(() => {
                        this.errorMessage.set(res.message || 'Registration failed');
                    });
                } else {
                    this.router.navigate(['/dashboard']);
                }
            },
            error: (err) => {
                this.zone.run(() => {
                    this.errorMessage.set(err.error?.message || err.message || 'Server Error');
                });
            }
        });
    }
}