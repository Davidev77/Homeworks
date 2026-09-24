import { Routes } from '@angular/router';
import { buildMenuTree } from './data/menu-data';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';

const tree = buildMenuTree();

// Cada hoja del árbol (ítem con link + component) se convierte en una ruta
// Todas usan el mismo componente "placeholder", pero cada una recibe su
// propio título vía route data, simulando que cada nodo del árbol "tiene un componente" asociado
const leafRoutes: Routes = tree.getAllLeaves().map((leaf) => ({
  path: leaf.link!.replace(/^\//, ''),
  component: MenuPageComponent,
  data: { title: leaf.title },
}));

export const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  ...leafRoutes,
  { path: '**', redirectTo: 'profile' },
];
