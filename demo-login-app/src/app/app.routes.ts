import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { Login } from './pages/login/login';
import { Shell } from './layout/shell';
import { ExerciseOne } from './pages/exercise-one/exercise-one';
import { ExerciseTwo } from './pages/exercise-two/exercise-two';
import { buildMenuTree } from './pages/exercise-two/menu-data';
import { MenuNode } from './pages/exercise-two/menu-node';
import { MenuPageComponent } from './pages/exercise-two/menu-page.component';

function firstLeafLink(node: MenuNode): string | null {
  if (node.link) return node.link;

  for (const child of node.children) {
    const link = firstLeafLink(child);
    if (link) return link;
  }

  return null;
}

function createMenuRoutes(nodes: MenuNode[], depth = 0): Routes {
  const routes: Routes = [];

  for (const node of nodes) {
    if (node.hasChildren) {
      const path = firstLeafLink(node)?.split('/').filter(Boolean)[depth];
      if (path) {
        routes.push({
          path,
          children: createMenuRoutes(node.children, depth + 1),
        });
      }
      continue;
    }

    const path = node.link?.split('/').filter(Boolean)[depth];
    if (path) {
      routes.push({
        path,
        component: MenuPageComponent,
        data: { title: node.title },
      });
    }
  }

  return routes;
}

const menuRoutes = createMenuRoutes(buildMenuTree().root.children);

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'exercise-1' },
      { path: 'exercise-1', component: ExerciseOne },
      {
        path: 'exercise-2',
        component: ExerciseTwo,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'profile' },
          ...menuRoutes,
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];