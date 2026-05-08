import { Component, Inject, inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogContent, MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { CompanyService } from "../../../../core/services/company.service";
import { filter, Observable, switchMap, take, tap } from "rxjs";
import { Company } from "../../../../core/models/company.model";
import { CompanyConfig } from "../../../../core/models/companyConfig.model";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProjectsService } from "../../../../core/services/projects.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Boards } from "../../../../core/models/projects.model";
@Component({
    selector: "app-configuration",
    templateUrl: "./configuration-dialog.component.html",
    styleUrls: ["./configuration-dialog.component.css"],
    imports: [ReactiveFormsModule, CommonModule, MatSelectModule, MatInputModule, MatStepperModule, MatFormFieldModule, MatDialogContent, MatDialogActions, MatButtonModule]
})
export class ConfigurationDialogComponent implements OnInit {
    @ViewChild('stepper') stepper!: MatStepper;
    integrationForm!: FormGroup;
    companyService = inject(CompanyService);
    projectService = inject(ProjectsService);
    selectedBoardId: string | null = null;
    companyConfigs$!: Observable<CompanyConfig[] | null>;
    constructor(private snackBar: MatSnackBar,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ConfigurationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { projectId: number; companyId: number }
    ) { }
    boards: Boards[] = [];
    isLoadingBoards = false;

    connectProvider() {
        const provider = this.integrationForm.get('provider')?.value;
        const { projectId, companyId } = this.data;

        if (!provider) return;

        // 1. Define handler
        const messageHandler = (event: MessageEvent) => {
            // Log everything for debugging
            console.log("Message received from:", event.origin, "Data:", event.data);

            if (event.data === 'integration-success') {
                this.snackBar.open(`Connected to ${provider}!`, 'Close', { duration: 3000 });
                this.fetchBoards(provider, projectId, companyId);
                window.removeEventListener('message', messageHandler);
            }
        };

        // 2. Start listening immediately
        window.addEventListener('message', messageHandler);

        // 3. Get URL and open popup
        this.projectService.connectIntegration(provider, projectId, companyId)
            .subscribe({
                next: (res) => {
                    window.open(res.url, 'External Integration', 'width=600,height=700');
                },
                error: () => {
                    window.removeEventListener('message', messageHandler);
                }
            });
    }
    fetchBoards(provider: string, projectId: number, companyId: number) {
        this.isLoadingBoards = true;
        this.projectService.getBoards(provider, projectId, companyId).subscribe({
            next: (boards) => {
                this.boards = boards;
                setTimeout(() => {
                    if (boards?.length) {
                        this.stepper.next();
                    }
                });
                this.isLoadingBoards = false;

            },
            error: () => {
                this.snackBar.open('Failed to load boards', 'Close');
                this.isLoadingBoards = false;
            }
        });
    }
    saveBoardSelection(boardId: string, projectKey: string) {
        const { projectId, companyId } = this.data;
        const provider = this.integrationForm.get('provider')?.value;

        this.projectService.linkBoard({
            provider,
            projectId,
            companyId,
            boardId,
            projectKey
        }).subscribe(() => {
            this.snackBar.open('Project linked and tasks imported!', 'Success');
            this.stepper.next();
            // this.dialogRef.close(true);
        });
    }
    getBoardKey(boardId: string): string {
        return this.boards.find(b => b.id === boardId)?.key || '';
    }

    ngOnInit(): void {
        this.companyService.loadCompanyIfNeeded().pipe(
            filter((c): c is Company => c !== null),
            take(1),
            switchMap(c => this.companyService.getCompanyConfig(c.id)),
            tap(config => this.companyService.companyConfigSubject.next(config))
        ).subscribe();
        this.companyConfigs$ = this.companyService.companyConfig$;

        this.integrationForm = this.fb.group({
            provider: '',

        })
    }
}