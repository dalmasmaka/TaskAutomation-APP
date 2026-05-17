import { Component } from "@angular/core";
import { DashboardComponent } from "../../../features/dashboard/dashboard.component";
import { SidenavComponent } from "../sidenav/sidenav.component";
import { RouterModule } from "@angular/router";

@Component({
    standalone: true,
    selector: "app-main-layout",
    templateUrl: "./mainlayout.component.html",
    styleUrls: ["./mainlayout.component.css"],
    imports: [SidenavComponent, RouterModule]
})
export class MainLayoutComponent {

}