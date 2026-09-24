import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuTree } from './models/menu-node';
import { buildMenuTree } from './data/menu-data';
import { SidebarMenuComponent } from './sidebar/sidebar-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // El árbol N-ario completo del menú
  tree: MenuTree = buildMenuTree();

  constructor() {
    // Imprime la estructura del árbol en consola (se pueden ver con F12)
    console.log('Árbol de menú (N-ario):');
    this.tree.printToConsole();
  }
}
