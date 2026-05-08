import { Component, inject, OnInit } from "@angular/core";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { MatListItem } from "@angular/material/list";
import { MatSidenavContainer } from "@angular/material/sidenav";
import { MatListItemIcon } from "@angular/material/list";
import { MatActionList } from "@angular/material/list";
import { MatListItemAvatar } from "@angular/material/list";
import { MatListItemTitle } from "@angular/material/list";
import { MatListItemLine } from "@angular/material/list";
import { MatAccordion } from "@angular/material/expansion";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterLinkActive } from "@angular/router";
import { RouterModule } from "@angular/router";
import { JwtService } from "../../services/jwt.service";
import { UserService } from "../../services/user.service";
import { Observable } from "rxjs";
import { User } from "../../models/auth-models";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    standalone: true,
    selector: "app-sidenav",
    templateUrl: "./sidenav.component.html",
    styleUrls: ["./sidenav.component.css"],
    imports: [MatSidenavModule, MatNavList, MatListItem, RouterModule,
        MatSidenavContainer, MatListItemIcon, MatTooltipModule,
        MatAccordion, CommonModule, MatExpansionModule, MatIconModule]
})
export class SidenavComponent implements OnInit {
    private userService = inject(UserService);
    public jwtService = inject(JwtService);
    currentUser$!: Observable<User | null>;
    constructor(private router: Router) {

    }
    ngOnInit(): void {
        this.currentUser$ = this.userService.user$;
        this.userService.getCurrentUser().subscribe();
    }
    getInitials(name: string): string {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
    logout(): void {
        this.jwtService.removeAuth();
        window.location.href = '/login';
        // this.router.navigate(['/login']);
    }
}
