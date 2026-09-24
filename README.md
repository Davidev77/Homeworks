# N-ary Tree Sidebar Menu

Sidebar de navegación construido a partir de un **árbol N-ario** (cada nodo
puede tener cualquier cantidad de hijos), replicando el patrón de
menús/submenús de la maqueta (Profile, Messages, Settings con submenú,
Help con submenú, Logout).

## Cumplimiento de los requisitos

1. **Nuevo proyecto Angular** — creado con `@angular/cli` (standalone
   components, routing habilitado).

2. **Árbol N-ario con menús y submenús, cada ítem con título, link y
   componente**
   - `src/app/models/menu-node.ts` → clase `MenuNode` (título, `link`
     opcional, `component` opcional, `children: MenuNode[]`) y clase
     `MenuTree` (raíz virtual + utilidades: `addTopLevel`, `getAllLeaves`,
     `printToConsole`).
   - `src/app/data/menu-data.ts` → construye el árbol de ejemplo:
     ```
     Profile
     Messages
     Settings
       Account
       Profile
       Security & Privacy
       Password
       Notification
     Help
       FAQ's
       Submit a Ticket
       Network Status
     Logout
     ```
   - Cada ítem hoja (sin submenú) tiene `link` + `component`; los ítems
     con hijos (Settings, Help) actúan como secciones desplegables.
   - `src/app/app.routes.ts` genera automáticamente una ruta por cada hoja
     del árbol (`tree.getAllLeaves()`), asociándola a un componente.

3. **Sidebar en pantalla imprimiendo el árbol**
   - `src/app/sidebar/sidebar-menu.component.ts` es un componente
     **recursivo**: si un nodo tiene hijos, se dibuja como encabezado
     desplegable y el mismo componente vuelve a invocarse para renderizar
     sus hijos (`<app-sidebar-menu [nodes]="node.children" ... />`); si no
     tiene hijos, se dibuja como enlace (`routerLink`) al componente de esa
     ruta.
   - El estilo oscuro con la sección activa resaltada en azul reproduce la
     maqueta.
   - Además, `AppComponent` imprime el árbol completo en la consola del
     navegador (`tree.printToConsole()`) al iniciar, para verificar la
     estructura N-aria de forma textual/jerárquica.

## Cómo correrlo

```bash
npm install
npm start        # ng serve
```

Abre `http://localhost:4200` y abre la consola (F12) para ver el árbol
impreso.


