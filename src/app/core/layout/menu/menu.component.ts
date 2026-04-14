import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MenuItem } from '../../models/menu-model';
import { ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';



@Component({
    selector: 'app-menu',
    standalone: true,
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [MatMenuModule, MatIconModule, MatButtonModule]
})
export class MenuComponent {

    @ViewChild(MatMenu) menu!: MatMenu;
    @Input() items: MenuItem[] = [];
    @Input() context: any;

    @Output() itemClick = new EventEmitter<{ action: string, context: any }>();

    onClick(item: MenuItem) {
        this.itemClick.emit({
            action: item.action,
            context: this.context
        });
    }
}