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
        MatCardModule
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
    @ViewChild('stepper') stepper!: MatStepper;

    workspaceGroup: FormGroup;
    accountGroup: FormGroup;

    selectedRole = signal<string>('owner');
    isInviteOnly = false;

    constructor(private route: ActivatedRoute) {
        // Group 1: Workspace logic
        this.workspaceGroup = new FormGroup({
            role: new FormControl('owner', Validators.required),
            workspaceName: new FormControl('', Validators.required),
            inviteCode: new FormControl('')
        });

        // Group 2: Account logic
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
            this.selectedRole.set('developer');
            this.workspaceGroup.patchValue({ role: 'developer', inviteCode: invite });
            this.updateValidation('developer');
        }

        // React to role changes
        this.workspaceGroup.get('role')?.valueChanges.subscribe(role => {
            this.selectedRole.set(role);
            this.updateValidation(role);
        });
    }

    ngAfterViewInit() {
        // If invited, skip to step 2 automatically
        if (this.isInviteOnly) {
            setTimeout(() => this.stepper.next(), 0);
        }
    }

    private updateValidation(role: string) {
        const inviteCtrl = this.workspaceGroup.get('inviteCode');
        const workspaceCtrl = this.workspaceGroup.get('workspaceName');

        if (role === 'developer') {
            inviteCtrl?.setValidators([Validators.required]);
            workspaceCtrl?.clearValidators();
        } else {
            workspaceCtrl?.setValidators([Validators.required]);
            inviteCtrl?.clearValidators();
        }

        inviteCtrl?.updateValueAndValidity();
        workspaceCtrl?.updateValueAndValidity();
    }

    onFinish() {
        if (this.workspaceGroup.valid && this.accountGroup.valid) {
            const finalData = {
                ...this.workspaceGroup.getRawValue(),
                ...this.accountGroup.getRawValue()
            };
            console.log('Registering:', finalData);
            // Call your service here
        }
    }
}