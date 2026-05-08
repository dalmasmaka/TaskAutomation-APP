import { Component, inject, Inject, OnInit, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContainer, MatDialogContent } from "@angular/material/dialog";
import { Review } from "../../../../core/models/pull-requests.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PullRequestsService } from "../../../../core/services/pullrequests.service";
import { MatTableModule } from "@angular/material/table";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
@Component({
    standalone: true,
    selector: "app-reviews-dialog",
    templateUrl: './reviews-dialog.component.html',
    styleUrls: ['./reviews-dialog.component.css'],
    imports: [CommonModule, ReactiveFormsModule, MatDialogContent, MatTableModule, MatDialogContent],
})
export class ReviewsDialogComponent implements OnInit {
    private prService = inject(PullRequestsService);
    private snackBar = inject(MatSnackBar);
    readonly reviews = signal<Review[]>([]);

    constructor(
        public dialogRef: MatDialogRef<ReviewsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { prId: number }
    ) { }

    displayedColumns: string[] = [
        'comment',
        'decision',
        'reviewer'
    ];

    ngOnInit(): void {
        this.fetchInitialData();
    }

    private fetchInitialData(): void {
        this.prService.loadReviews(this.data.prId).subscribe(r => this.reviews.set(r ?? []));
    }

    deleteReview(reviewId: string): void {
        // this.projectService.removeMemberFromProject(this.data.projectId, memberId).subscribe({
        //     next: () => {
        //         // Update signal locally for instant UI feedback
        //         this.members.update(prev => prev.filter(m => m.id !== memberId));
        //         this.notify('Member removed');
        //     },
        //     error: () => this.notify('Failed to remove', true)
        // });
    }

    private notify(message: string, isError = false): void {
        this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
        });
    }
}