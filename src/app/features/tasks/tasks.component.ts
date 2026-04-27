import { Component, inject, OnInit, signal, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TasksService } from "../../core/services/tasks.service";
import { PagedResult, TasksQuery, Tasks } from "../../core/models/tasks-model";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { MatButtonModule } from "@angular/material/button";
import { CompanyUser } from "../../core/models/company-assets.model";
import { CompanyProject } from "../../core/models/company-assets.model";
import { ActionModalComponent } from "../../core/layout/action-modals/action-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CodeGenerationDialogComponent } from "./forms/generate-code/generate-code-dialog.component";
import { UpdateTaskDialogComponent } from "./forms/update/update-task-dialog.component";
import { Team } from "../team/model/team.model";
import { ProjectsService } from "../../core/services/projects.service";
import { JwtService } from "../../core/services/jwt.service";
import { TruncatePipe } from "../../shared/pipes/truncate.pipe";
import { Observable } from "rxjs";
import { forkJoin } from 'rxjs';
@Component({
    selector: "app-tasks",
    standalone: true,
    templateUrl: "./tasks.component.html",
    styleUrls: ["./tasks.component.css"],
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MenuComponent,
        MatCheckboxModule,
        MatButtonModule,
        TruncatePipe
    ]
})

export class TasksComponent implements OnInit {
    private tasksService = inject(TasksService);
    readonly dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private jwtService = inject(JwtService);
    totalTasks = 0;
    dataSource = new MatTableDataSource<Tasks>([]);
    public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');
    paged$!: Observable<PagedResult | null>;
    displayedColumns: string[] = [
        'title',
        'description',
        'status',
        'priority',
        // 'assignedTo',
        'project',
        'actions'
    ];

    query: TasksQuery = {
        pageNumber: 1,
        pageSize: 10,
        companyId: '',
        projectIds: [],
        status: '',
        priority: '',
        search: '',
        assignedToIds: [],
    };

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit() {
        this.paged$ = this.tasksService.paged$;
        this.load();
        // this.loadAssets();

    }




load() {
    forkJoin({
        _: this.tasksService.loadTasks(this.query), // triggers paged$
        assets: this.tasksService.loadCompanyAssets()
    }).subscribe(({ assets }) => {
        this.projects = assets.projects ?? [];
        this.assignees = assets.assigners ?? [];
    });
}
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        this.query.search = filterValue;
        this.query.pageNumber = 1;

        this.load();
    }
    statusOptions = ['To Do', 'In Progress', 'Done'];
    priorityOptions = ['Low', 'Medium', 'High', 'Highest'];
    importStatusOptions = ['Imported', 'Pending', 'Failed'];
    assignees: CompanyUser[] = [];
    projects: CompanyProject[] = [];

    selectFilter(type: string, value: string) {
        console.log(`Filtering ${type} by ${value}`);
        (this.query as any)[type] = value;
        this.load();
    }

    getPriorityClass(priority: string): string {
        switch (priority) {
            case 'Low':
                return 'priority-low';
            case 'Medium':
                return 'priority-medium';
            case 'High':
                return 'priority-high';
            case 'Urgent':
                return 'priority-urgent';
            default:
                return '';
        }
    }
    selections: TaskSelections = {
        status: [],
        priority: [],
        importStatus: [],
        assignedTo: [],
        project: []
    };

    toggleFilter(field: keyof TaskSelections, value: any) {
        const list = this.selections[field];

        const parsedValue =
            typeof list[0] === 'number' ? Number(value) : value;

        const index = list.indexOf(parsedValue as never);

        if (index > -1) {
            list.splice(index, 1);
        } else {
            list.push(parsedValue as never);
        }
    }
    getFilterLabel(label: string, field: keyof TaskSelections): string {
        const selectedIds = this.selections[field];
        if (selectedIds.length === 0) return label;

        if (field === 'assignedTo') {
            const firstUser = this.assignees.find(u => u.id === selectedIds[0]);
            const name = firstUser ? firstUser.fullName : 'Unknown';

            if (selectedIds.length === 1) return `${label} | ${name}`;
            return `${label} | ${name} and ${selectedIds.length - 1} more`;
        }
        if (field === 'project') {
            const firstUser = this.projects.find(u => u.projectId === selectedIds[0]);
            const name = firstUser ? firstUser.name : 'Unknown';

            if (selectedIds.length === 1) return `${label} | ${name}`;
            return `${label} | ${name} and ${selectedIds.length - 1} more`;
        }
        if (selectedIds.length === 1) return `${label} | ${selectedIds[0]}`;
        return `${label} | ${selectedIds[0]} and ${selectedIds.length - 1} more`;
    }
    applyFilters() {
        this.query.status = this.selections['status'].join(',');
        this.query.priority = this.selections['priority'].join(',');
        this.query.assignedToIds = this.selections['assignedTo'];
        this.query.projectIds = this.selections['project'];
        console.log(this.query + "dalma")
        this.load();
    }

    clearField(field: keyof TaskSelections, event: MouseEvent) {
        event.stopPropagation();
        this.selections[field] = [] as any;
        this.applyFilters();
    }
    handlePageEvent(event: any) {
        this.query.pageNumber = event.pageIndex + 1;
        this.query.pageSize = event.pageSize;
        this.load();
    }
    get tasksMenuItems() {
        return [
            ...(this.isDeveloper ? [{ label: 'Generate Code', icon: 'bolt', action: 'generate' },] : [
                { label: 'Generate Code', icon: 'bolt', action: 'generate' },
                { label: 'Update Task', icon: 'edit', action: 'update' },
                { label: 'Delete Task', icon: 'delete', action: 'delete' }
            ]),

        ];
    }
    handleMenuAction(event: any) {
        const task = event.context;
        switch (event.action) {
            case 'generate':
                this.generateCode(task);
                break;
            case 'update':
                this.updateTask(task)
                break;
            case 'delete':
                this.deleteTask(task.taskId);
                break;
        }
    }
    updateTask(task: any) {
        const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
            minWidth: '650px',
            data: task
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.tasksService.updateTask(result).subscribe({
                    next: () => {
                        this.snackBar.open('Task updated successfully!', 'Close', {
                            duration: 3000
                        });
                        this.load();
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to delete member');
                    }
                })
            }
        })
    }
    generateCode(task: any) {
        const dialogRef = this.dialog.open(CodeGenerationDialogComponent, {
            minWidth: '1000px'
        });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
            //     this.tasksService.deleteTask(projectId).subscribe({
            //         next: () => {
            //             this.snackBar.open('Member account deleted successfully!', 'Close', {
            //                 duration: 3000
            //             });
            //             this.load();
            //         },
            //         error: (err) => {
            //             this.snackBar.open('Failed to delete member');
            //         }
            //     })
            // }
        })
    }

    deleteTask(projectId: number) {
        const dialogRef = this.dialog.open(ActionModalComponent, {
            minWidth: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.tasksService.deleteTask(projectId).subscribe({
                    next: () => {
                        this.snackBar.open('Member account deleted successfully!', 'Close', {
                            duration: 3000
                        });
                        this.load();
                    },
                    error: (err) => {
                        this.snackBar.open('Failed to delete member');
                    }
                })
            }
        })
    }
    editTask(row: any) {

    }
}
interface TaskSelections {
    status: string[];
    priority: string[];
    importStatus: string[];
    assignedTo: string[];
    project: number[];
}