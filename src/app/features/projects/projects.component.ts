import { Component, inject, OnInit } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { Projects } from "../../core/models/projects.model";
import { ProjectsService } from "../../core/services/projects.service";
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { MembersDialogComponent } from "./forms/project-members/members-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { CreateProjectDialogComponent } from "./forms/create/create-project-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfigurationDialogComponent } from "./forms/configuration/configuration-dialog.component";
import { ActivatedRoute } from "@angular/router";
import { JwtService } from "../../core/services/jwt.service";
import { UpdateProjectDialogComponent } from "./forms/update/update-project-dialog.component";
@Component({
    selector: "app-projects",
    templateUrl: "./projects.component.html",
    styleUrls: ["./projects.component.css"],
    imports: [MenuComponent, MatCardModule, MatIconModule, MatDividerModule, AsyncPipe, MatGridListModule, MatProgressSpinnerModule, MatMenuModule, MatButtonModule],
})
export class ProjectsComponent implements OnInit {
    projects$!: Observable<Projects[] | null>;
    private projectsService = inject(ProjectsService);
    readonly dialog = inject(MatDialog);
    public jwtService = inject(JwtService);
    private snackBar = inject(MatSnackBar);
    private route = inject(ActivatedRoute);
    public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');

    ngOnInit(): void {
        this.projects$ = this.projectsService.projects$;
        this.projectsService.loadProjects().subscribe();

        this.route.queryParams.subscribe(params => {
            if (params['integrationSuccess'] === 'true') {
                const projectId = params['projectId'];
                const companyId = params['companyId'];

                if (projectId && companyId) {
                    this.configuration(projectId, companyId);

                    this.snackBar.open('Integration linked successfully!', 'Close', {
                        duration: 5000
                    });
                }
            }
        });
    }

    getFilteredMenuItems(project: any) {
        const items = [];
        items.push({
            label: 'Project Members',
            icon: 'groups',
            action: 'members'
        });
        if (this.isOwner && !project.hasConfig) {
            items.push({
                label: 'Project Configuration',
                icon: 'settings',
                action: 'config'
            });
        }

        if (this.isOwner) {
            items.push({
                label: 'Update Project',
                icon: 'edit',
                action: 'update'
            });
            // items.push({
            //     label: 'Delete Project',
            //     icon: 'delete',
            //     action: 'delete'
            // });
        }



        return items;
    }
    handleMenuAction(event: any) {
        const project = event.context;
        switch (event.action) {
            case 'members':
                this.loadMembers(project.projectId);
                break;
            case 'config':
                this.configuration(project.projectId, project.companyId);
                break;
            case 'update':
                this.saveProject(project);
                break;
        }
    }
    configuration(id: any, companyId: any) {
        const dialogRef = this.dialog.open(ConfigurationDialogComponent, {
            minWidth: '700px',
            minHeight: '600px',
            data: { projectId: id, companyId: companyId }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.projectsService.loadProjects(true).subscribe();
        })
    }
    loadMembers(id: any) {
        const dialogRef = this.dialog.open(MembersDialogComponent, {
            minWidth: '700px',
            minHeight: '600px',
            data: { projectId: id }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.projectsService.loadProjects(true).subscribe();
        })
    }
    addProject() {
        const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
            minWidth: '500px',

        })
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.projectsService.saveProject(result).subscribe({

                    next: () => {
                        this.snackBar.open('Project created successfully!', 'Close', {
                            duration: 3000
                        });
                        this.projectsService.loadProjects(true).subscribe();
                    },
                    error: (err) => {
                        this.snackBar.open('Error creating project.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
    }
    async saveProject(project: any) {
        const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
            minWidth: '500px',
            data: project

        })
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.projectsService.saveProject(result).subscribe({

                    next: () => {
                        this.snackBar.open('Project updated successfully!', 'Close', {
                            duration: 3000
                        });
                        this.projectsService.loadProjects(true).subscribe();
                    },
                    error: (err) => {
                        this.snackBar.open('Error updating project.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        });
    }

}