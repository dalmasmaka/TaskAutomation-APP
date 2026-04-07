import { Component, inject, OnInit } from "@angular/core";
import { Team } from "./model/team.model";
import { Observable } from "rxjs";
import { CompanyService } from "../../core/services/company.service";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: "app-team",
    templateUrl: "./team.component.html",
    styleUrls: ["./team.component.css"]
})
export class TeamComponent implements OnInit{
    team$!: Observable<Team | null>;
    private companyService = inject(CompanyService);

    ngOnInit(): void {
        this.team$ = this.companyService.team$;
        this.companyService.loadTeam().subscribe();
    }
}