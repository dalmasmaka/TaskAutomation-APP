import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MenuComponent } from "../../core/layout/menu/menu.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { PullRequestsService } from "../../core/services/pullrequests.service";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtService } from "../../core/services/jwt.service";
import { PagedPrResult, PrSelections, PRsQuery, PullRequest } from "../../core/models/pull-requests.model";
import { forkJoin, Observable } from "rxjs";
import { TasksService } from "../../core/services/tasks.service";
import { CompanyProject, CompanyUser } from "../../core/models/company-assets.model";
import { ReviewCreationDialogComponent } from "./forms/create-reviews/review-creation-dialog.component";
import { ReviewsDialogComponent } from "./forms/reviews/reviews-dialog.component";


@Component({
    selector: "app-pull-requests",
    templateUrl: "./pull-requests.component.html",
    styleUrls: ["./pull-requests.component.css"],
    imports: [CommonModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MenuComponent,
        MatCheckboxModule,
        MatButtonModule]
})
export class PullRequestsComponent implements OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    private prService = inject(PullRequestsService);
    private tasksService = inject(TasksService);
    readonly dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);
    private jwtService = inject(JwtService);
    totalTasks = 0;
    dataSource = new MatTableDataSource<PullRequest>([]);
    public isOwner = this.jwtService.hasRole('Owner');
    public isDeveloper = this.jwtService.hasRole('Developer');
    paged$!: Observable<PagedPrResult | null>;
    projects: CompanyProject[] = [];
    creators: CompanyUser[] = [];
    displayedColumns: string[] = [
        'taskId',
        'branchName',
        'prUrl',
        'prName',
        // 'prDescription',
        'status',
        'createdBy',
        'projectName',
        'actions'
    ];
    query: PRsQuery = {
        pageNumber: 1,
        pageSize: 10,
        companyId: '',
        projectIds: [],
        status: '',
        priority: '',
        search: '',
        createdByIds: [],
        taskIds: []
    };
    ngOnInit(): void {
        this.paged$ = this.prService.paged$;
        this.load();

    }
    load() {
        this.prService.loadPRs(this.query).subscribe();
        forkJoin({
            _: this.prService.loadPRs(this.query), // triggers paged$
            assets: this.tasksService.loadCompanyAssets()
        }).subscribe(({ assets }) => {
            this.projects = assets.projects ?? [];
            this.creators = assets.assigners ?? [];
        });
    }
    selectFilter(type: string, value: string) {
        console.log(`Filtering ${type} by ${value}`);
        (this.query as any)[type] = value;
        this.load();
    }
    statusOptions = ['Open', 'Need Changes', 'Rejected', 'Approved'];
    selections: PrSelections = {
        status: [],
        project: [],
        task: [],
        createdById: []
    };
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;

        this.query.search = filterValue;
        this.query.pageNumber = 1;

        this.load();
    }
    toggleFilter(field: keyof PrSelections, value: any) {
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
    getFilterLabel(label: string, field: keyof PrSelections): string {
        const selectedIds = this.selections[field];
        if (selectedIds.length === 0) return label;

        if (field === 'createdById') {
            const firstUser = this.creators.find(u => u.id === selectedIds[0]);
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
        if (field === 'task') {
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
        this.query.createdByIds = this.selections['createdById'];
        this.query.taskIds = this.selections['task'];
        this.query.projectIds = this.selections['project'];
        this.load();
    }
    clearField(field: keyof PrSelections, event: MouseEvent) {
        event.stopPropagation();
        this.selections[field] = [] as any;
        this.applyFilters();
    }
    handlePageEvent(event: any) {
        this.query.pageNumber = event.pageIndex + 1;
        this.query.pageSize = event.pageSize;
        this.load();
    }
    get prMenuItems() {
        return [
            ...(this.isDeveloper ? [{ label: 'Reviews', icon: 'rate_review', action: 'reviews' }] : [
                { label: 'Add Review', icon: 'add', action: 'add-review' },
                { label: 'Reviews List', icon: 'rate_review', action: 'reviews' }
            ]),

        ];
    }
    handleMenuAction(event: any) {
        const review = event.context;
        switch (event.action) {
            case 'reviews':
                 this.loadReviews(review.prId);
                break;
            case 'add-review':
                this.addReview(review);
                break;
           
        }
    }
    loadReviews(prId: number) {
        const dialogRef = this.dialog.open(ReviewsDialogComponent, {
            minWidth: '500px',
            data: { prId }
        });
        dialogRef.afterClosed().subscribe(result => {
          
        })
    }
    addReview(review: any) {
        const dialogRef = this.dialog.open(ReviewCreationDialogComponent, {
            minWidth: '500px',
            data: review
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
                this.prService.addReview(result).subscribe({

                    next: () => {
                        this.snackBar.open('Review added successfully!', 'Close', {
                            duration: 3000
                        });
                        this.load();}
                    ,
                    error: (err) => {
                        this.snackBar.open('Error adding review.', 'Close', {
                            duration: 3000
                        });
                    }
                });
            }
        })
    }
}