import { CommonModule } from "@angular/common";
import { Component, Inject, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader } from "@angular/material/expansion";
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, map, Observable } from "rxjs";
import { Team } from "../../../team/model/team.model";
import { ProjectsService } from "../../../../core/services/projects.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCardModule } from '@angular/material/card';
import { User } from "../../../../core/models/auth-models";
import { MultiSelectSearchComponent } from "../../../../core/layout/multi-select/multi-select.component";
@Component({
    selector: "app-members",
    templateUrl: './members-dialog.component.html',
    styleUrls: ['./members-dialog.component.css'],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatChipsModule,
        MatTooltipModule,
        MatInputModule,
        MatFormFieldModule,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MultiSelectSearchComponent
    ],
})
export class MembersDialogComponent implements OnInit {
 private projectService = inject(ProjectsService);
    private fb = inject(FormBuilder);
    private snackBar = inject(MatSnackBar);

    // --- State Management via Signals ---
    readonly members = signal<Team[]>([]);
    readonly availableUsers = signal<User[]>([]);
    readonly isLoading = signal<boolean>(false);

    userForm: FormGroup = this.fb.group({
        users: [[]] 
    });

    displayedColumns: string[] = ['fullName', 'role', 'actions'];

    constructor(
        public dialogRef: MatDialogRef<MembersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { projectId: string }
    ) {}

    ngOnInit(): void {
        this.fetchInitialData();
    }

    /**
     * Load all necessary data at once
     */
    private fetchInitialData(): void {
        this.isLoading.set(true);
        
        // Use forkJoin if you want them to finish together, 
        // or keep separate for independent loading states
        this.projectService.loadProjectMembers(this.data.projectId).subscribe(m => this.members.set(m ?? []));
        this.projectService.loadAvailableUsers(this.data.projectId).subscribe(u => this.availableUsers.set(u ?? []));
        
        this.isLoading.set(false);
    }

    /**
     * Logic for adding selected members
     */
    addMembers(): void {
        const selectedUserIds = this.userForm.value.users;
        if (!selectedUserIds?.length) return;

        this.isLoading.set(true);
        this.projectService.assignUsersToProject(this.data.projectId, selectedUserIds)
            .pipe(finalize(() => this.isLoading.set(false)))
            .subscribe({
                next: () => {
                    this.notify('Members added successfully');
                    this.userForm.reset();
                    this.fetchInitialData(); // Refresh list
                },
                error: () => this.notify('Error adding members', true)
            });
    }

    /**
     * Logic for removing a member
     */
    removeMember(memberId: string): void {
        this.projectService.removeMemberFromProject(this.data.projectId, memberId).subscribe({
            next: () => {
                // Update signal locally for instant UI feedback
                this.members.update(prev => prev.filter(m => m.id !== memberId));
                this.notify('Member removed');
            },
            error: () => this.notify('Failed to remove', true)
        });
    }

    // --- Helper Utilities ---

    private notify(message: string, isError = false): void {
        this.snackBar.open(message, 'Close', { 
            duration: 3000,
            panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
        });
    }

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
}