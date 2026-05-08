import { CommonModule } from "@angular/common";
import { Component, inject, Inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Tasks } from "../../../../core/models/tasks-model";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { User } from "../../../../core/models/auth-models";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
import { SelectComponent } from "../../../../core/layout/select/select.component";
import { MatTabsModule } from '@angular/material/tabs';
import { TasksService } from "../../../../core/services/tasks.service";
import { MatListModule } from "@angular/material/list";
import { MenuComponent } from "../../../../core/layout/menu/menu.component";
import { MatCardAvatar, MatCardModule } from "@angular/material/card";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
    selector: "app-update-task",
    templateUrl: "update-task-dialog.component.html",
    styleUrls: ["update-task-dialog.component.css"],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatDialogActions,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MultiSelectSearchComponent,
        SelectComponent,
        MatTabsModule,
        MatListModule,
        MenuComponent,
        MatCardModule,
        MatCardAvatar
    ]
})
export class UpdateTaskDialogComponent {
    task: Tasks;
    taskForm!: FormGroup;
    readonly availableUsers = signal<User[]>([]);
    readonly projectTeam = signal<User[]>([]);
    readonly taskMembers = signal<User[]>([]);
    private taskService = inject(TasksService);
    private snackBar = inject(MatSnackBar);
    constructor(
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: Tasks,
        public dialogRef: MatDialogRef<UpdateTaskDialogComponent>
    ) {
        this.task = { ...data }
    }
    ngOnInit(): void {
        this.fetchInitialData();
        this.taskForm = this.fb.group({
            title: [this.data?.title || '', Validators.required],
            description: [this.data?.description || '', Validators.required],
            members: [this.data?.members],
            status: [this.data?.status],
            priority: [this.data?.priority],
        });
    }
    private fetchInitialData(): void {
        this.taskService.getAllMembers(this.data.taskId).subscribe(res => {
            this.projectTeam.set(res?.availableMembers ?? []);
            this.taskMembers.set(res?.assignedMembers ?? []);
        });
    }
    confirmChanges(): void {
        if (this.taskForm.valid) {
            const updatedTask = {
                ...this.data,
                ...this.taskForm.value
            };
            this.dialogRef.close(updatedTask);
        }
    }
    statuses = [
        { id: 'To Do', name: 'To Do' },
        { id: 'In Progress', name: 'In Progress' },
        { id: 'Done', name: 'Done' },
        { id: 'Selected for Development', name: 'Selected for Development' }
    ];

    priorities = [
        { id: 'Low', name: 'Low' },
        { id: 'Medium', name: 'Medium' },
        { id: 'High', name: 'High' },
        { id: 'Urgent', name: 'Urgent' }
    ];
    getInitials(name: string): string {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }

    getAvatarTheme(name: string) {
        const themes = [
            { bg: '#E8F5E9', text: '#2E7D32' }, { bg: '#E3F2FD', text: '#1565C0' },
            { bg: '#F3E5F5', text: '#7B1FA2' }, { bg: '#FFF3E0', text: '#E65100' },
            { bg: '#FCE4EC', text: '#C2185B' }
        ];
        let hash = [...name].reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        return themes[Math.abs(hash) % themes.length];
    }
    displayedColumns: string[] = ['fullName', 'role', 'actions'];
    configMenuItems = [
        { label: 'Unassign User', icon: 'delete', action: 'delete' },
    ];
    handleMenuAction(event: any) {
        const member = event.context;
        switch (event.action) {
            case 'delete':
                this.removeMember(member.id)
                break;
        }
    }
    removeMember(userId: string): void {
        this.taskService.removeMemberFromTask(userId, this.data.taskId).subscribe({
            next: () => {
                const removedUser = this.taskMembers().find(m => m.id === userId);
                this.taskMembers.update(prev => prev.filter(m => m.id !== userId));
                if (removedUser) {
                    this.projectTeam.update(prev => [...prev, removedUser]);
                }
                this.notify('Member removed');
            },
            error: () => this.notify('Failed to remove', true)
        });
    }
    private notify(message: string, isError = false): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
        });
    }
}