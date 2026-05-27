import { Component, EventEmitter, inject, OnInit, Output, signal } from "@angular/core";
import { DashboardService } from "../../core/services/dashboard.service";
import { DashboardInsights, PREngagement, TimeRange, WorkloadInsights } from "../../core/models/insights.model";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms"; // 👈 1. Import FormsModule
import { MatCardModule } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatListModule } from "@angular/material/list";
import { Team } from "../../core/models/teams-model";
import { TeamService } from "../../core/services/teams.service";
import { SelectComponent } from "../../core/layout/select/select.component";

@Component({
    standalone: true,
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
    imports: [
        CommonModule,
        FormsModule, // 👈 2. Add FormsModule here
        MatCardModule,
        MatDivider,
        MatListModule,
        SelectComponent
    ]
})
export class DashboardComponent implements OnInit {
    private dashService = inject(DashboardService);
    private teamsService = inject(TeamService);
    
    insights$!: Observable<DashboardInsights | null>;
    workload$!: Observable<WorkloadInsights | null>;
    prs$!: Observable<PREngagement | null>;
    
    @Output() selectionChange = new EventEmitter<number>();
    selectedTeamId: number | undefined; 
    
    readonly teams = signal<Team[]>([]);
    timeRange = TimeRange;
    currentRange: TimeRange = TimeRange.Week;
    currentPrRange: TimeRange = TimeRange.Week;

    ngOnInit(): void {
        this.loadInsights();
        this.loadWorkload();   
        this.loadPrWorkload(); 
        
        this.teamsService.loadTeams(true).subscribe((teams) => {
            this.teams.set(teams ?? []);
        });
    }

    onTeamChange(teamId: number | undefined): void {
        this.selectedTeamId = teamId;
        this.selectionChange.emit(teamId); 
        this.loadInsights();
        this.loadWorkload();
        this.loadPrWorkload();
    }

    loadInsights(): void {
        this.insights$ = this.dashService.getInsights(this.selectedTeamId);
    }

    loadWorkload(range?: TimeRange): void {
        if (range !== undefined) {
            this.currentRange = range;
        }
        this.workload$ = this.dashService.getWorkloadInsights(
            this.currentRange,
            this.selectedTeamId
        );
    }

    loadPrWorkload(range?: TimeRange): void {
        if (range !== undefined) {
            this.currentPrRange = range;
        }
        this.prs$ = this.dashService.getPRsEngagement(
            this.currentPrRange,
            this.selectedTeamId
        );
    }

    isActive(range: TimeRange): boolean {
        return this.currentRange === range;
    }

    getColor(key: string): string {
        switch (key.toLowerCase()) {
            case 'owner': return '#efb100';
            case 'developer': return '#3b82f6';
            case 'team leader': return '#9ca3af';
            case 'manager': return '#10b981';
            case 'assigned': return '#3b82f6';
            case 'unassigned': return '#ef4444';
            case 'to do': return '#efb100';
            case 'in progress': return '#3b82f6';
            case 'selected for development': return '#9ca3af';
            case 'done': return '#10b981';
            case 'open': return '#9ca3af';
            case 'commented': return '#efb100';
            case 'approved': return '#10b981';
            case 'changesrequested': return '#ef4444';
            default: return '';
        }
    }

    calculateOffset(breakdown: any[], index: number): number {
        let offset = 25;
        for (let i = 0; i < index; i++) {
            offset -= breakdown[i].percentage;
        }
        return offset;
    }

    getProjectStatusLabel(key: string): string {
        switch (key.toLowerCase()) {
            case 'true': return 'Assigned';
            case 'false': return 'Unassigned';
            default: return key;
        }
    }

    setRange(range: TimeRange): void {
        this.currentRange = range;
        this.loadWorkload(range);
    }

    setPrRange(range: TimeRange): void {
        this.currentPrRange = range;
        this.loadPrWorkload(range);
    }
}