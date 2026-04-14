import { Component, inject, OnInit } from "@angular/core";
import { Observable } from "rxjs";
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
    ngOnInit(): void {
        this.projects$ = this.projectsService.projects$;
        this.projectsService.loadProjects().subscribe();
    }
    userMenuItems = [
        { label: 'Project Members', icon: 'groups', action: 'members' },
        { label: 'View Tasks', icon: 'assignment', action: 'tasks' },
        { label: 'Project Configuration', icon: 'settings', action: 'config' }
    ];


    handleMenuAction(event: any) {
        debugger
        const project = event.context;
        switch (event.action) {
            case 'members':
                this.loadMembers(project.projectId);
                break;
            case 'tasks':
                // this.changeRole(user.id);
                break;
            case 'config':
                // this.deleteUser(user.id);
                break;
        }
    }
    loadMembers(id: any) {
        const dialogRef = this.dialog.open(MembersDialogComponent, {
            minWidth: '700px',
            minHeight: '600px',
            data: { projectId: id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        })
    }
    
}