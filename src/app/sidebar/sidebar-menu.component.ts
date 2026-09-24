import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuNode } from '../models/menu-node';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SidebarMenuComponent],
  templateUrl: './sidebar-menu.component.html',
  styleUrl: './sidebar-menu.component.css',
})
export class SidebarMenuComponent implements OnInit {
  // Nodos de este nivel del árbol (raíz.children, o children de un padre)
  @Input({ required: true }) nodes: MenuNode[] = [];

  // Profundidad actual, usada solo para la indentación visual
  @Input() depth = 0;

  // Guarda qué nodos (por título) están expandidos en este nivel
  expanded = new Set<string>();

  ngOnInit(): void {
    // Por defecto, todos los submenús de este nivel arrancan expandidos
    // (igual que "Settings" y "Help" en la maqueta)
    this.nodes
      .filter((node) => node.hasChildren)
      .forEach((node) => this.expanded.add(node.title));
  }

  toggle(node: MenuNode): void {
    if (this.expanded.has(node.title)) {
      this.expanded.delete(node.title);
    } else {
      this.expanded.add(node.title);
    }
  }

  isExpanded(node: MenuNode): boolean {
    return this.expanded.has(node.title);
  }
}
