import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuTree } from './menu-node';
import { buildMenuTree } from './menu-data';
import { SidebarMenuComponent } from './sidebar/sidebar-menu.component';

@Component({
  selector: 'app-exercise-two',
  imports: [RouterOutlet, SidebarMenuComponent],
  templateUrl: './exercise-two.html',
  styleUrl: './exercise-two.css',
})
export class ExerciseTwo {
  tree: MenuTree = buildMenuTree();
}