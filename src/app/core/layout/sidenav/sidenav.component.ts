import { Component } from "@angular/core";
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
import { RouterLinkActive } from "@angular/router";
import { RouterModule } from "@angular/router";
import { JwtService } from "../../services/jwt.service";

@Component({
    standalone: true,
    selector: "app-sidenav",
    templateUrl: "./sidenav.component.html",
    styleUrls: ["./sidenav.component.css"],
    imports: [MatSidenavModule, MatNavList, MatListItem, RouterModule,
         MatSidenavContainer, MatListItemIcon, MatActionList, MatListItemAvatar, 
         MatListItemTitle, MatListItemLine, MatAccordion, CommonModule, MatExpansionModule, MatIconModule]
})
export class SidenavComponent {
    constructor(public jwtService: JwtService){

    }
 }
