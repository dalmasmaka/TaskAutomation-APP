import { Component, inject, OnInit } from "@angular/core";
import { DashboardService } from "../../core/services/dashboard.service";
import { DashboardInsights, PREngagement, TimeRange, WorkloadInsights } from "../../core/models/insights.model";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";

@Component({
    standalone: true,
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    imports: [
        CommonModule,
        MatCardModule,
        MatDivider,
        MatListModule
    ]
})
export class DashboardComponent implements OnInit {
    private dashService = inject(DashboardService);
    insights$!: Observable<DashboardInsights | null>;
    workload$!: Observable<WorkloadInsights | null>;
    prs$!: Observable<PREngagement | null>;
    timeRange = TimeRange;
    currentRange: TimeRange = TimeRange.Week;
    currentPrRange: TimeRange = TimeRange.Week;
    ngOnInit(): void {
        this.loadInsights();
        this.workload$ = this.dashService.getWorkloadInsights(this.currentRange).pipe();
        this.prs$ = this.dashService.getPRsEngagement(this.currentPrRange).pipe();
    }

    loadInsights(): void {
        this.insights$ = this.dashService.getInsights();

    }
    loadWorkload(range?: TimeRange): void {
        if (range !== undefined) {
            this.currentRange = range;
        }
        this.workload$ = this.dashService.getWorkloadInsights(this.currentRange);
    }
    loadPrWorkload(range?: TimeRange): void {
        if (range !== undefined) {
            this.currentPrRange = range;
        }
        this.prs$ = this.dashService.getPRsEngagement(this.currentPrRange);
    }

    isActive(range: TimeRange): boolean {
        return this.currentRange === range;
    }

    getColor(key: string): string {
        switch (key.toLowerCase()) {
            case 'owner':
                return '#efb100';
            case 'developer':
                return '#3b82f6';
            case 'team leader':
                return '#9ca3af';
            case 'project manager':
                return '#10b981';
            // Projects
            case 'true':
                return '#3b82f6';
            case 'false':
                return '#ef4444';

            // Tasks
            case 'to do':
                return '#efb100';
            case 'in progress':
                return '#3b82f6';
            case 'selected for development':
                return '#9ca3af';
            case 'done':
                return '#10b981';

            // PRs
            case 'open':
                return '#9ca3af';
            case 'commented':
                return '#efb100';
            case 'approved':
                return '#10b981';
            case 'changesrequested':
                return '#ef4444';

            default:
                return '';
        }
    }
    calculateOffset(
        breakdown: any[],
        index: number
    ): number {

        let offset = 25;

        for (let i = 0; i < index; i++) {
            offset -= breakdown[i].percentage;
        }

        return offset;
    }

    getProjectStatusLabel(key: string): string {

        switch (key.toLowerCase()) {

            case 'true':
                return 'Assigned';

            case 'false':
                return 'Unassigned';

            default:
                return key;
        }
    }
    setRange(range: TimeRange): void {
        this.currentRange = range;
        this.loadWorkload(range); // Refresh the workload observable
    }
    setPrRange(range: TimeRange): void {
        this.currentPrRange = range;
        this.loadPrWorkload(range); // Refresh the workload observable
    }
}