# Árbol Binario de Búsqueda (Angular + D3)

Proyecto Angular que implementa un **Árbol Binario de Búsqueda (BST)**, sus
recorridos clásicos, una función de búsqueda y una visualización con D3
(`d3-hierarchy` / `d3.tree`).

## Cumplimiento de los requisitos

1. **Insertar una serie de números en un nuevo árbol e imprimirlo en
   inorder – postorder – preorder por consola.**
   - Ver `src/app/binary-search-tree.ts` → clase `BinarySearchTree`.
   - Métodos `insert()`, `inOrder()`, `preOrder()`, `postOrder()`.
   - `printTraversalsToConsole()` imprime los tres recorridos con
     `console.log` cada vez que se inserta un valor (ver `AppComponent.refresh()`).
   - Abre la consola del navegador (F12) para ver la salida cada vez que
     insertas valores.

2. **Función para verificar si un valor está en el árbol.**
   - `BinarySearchTree.contains(value: number): boolean` (búsqueda O(log n)
     en promedio, recorriendo izquierda/derecha según corresponda).
   - Expuesta en la UI en la sección "Buscar un valor (contains)".

3. **D3 para visualizar el árbol, respetando la estructura de la librería.**
   - `npm install d3` y `npm install -D @types/d3` ya están en
     `package.json`.
   - `src/app/tree-view/tree-view.component.ts` usa exactamente el patrón
     de [`d3-hierarchy` / `d3.tree`](https://d3js.org/d3-hierarchy/tree):
     1. `d3.hierarchy(data)` para construir la jerarquía a partir de
        `{ value, children: [...] }`.
     2. `d3.tree().size([width, height])` para calcular el layout
        (Reingold–Tilford).
     3. `d3.linkVertical()` para dibujar las conexiones padre-hijo.
     4. Nodos y etiquetas dibujados como `<circle>` + `<text>` dentro de
        un `<svg>`.
   - El árbol del modelo (`BinarySearchTree`) se convierte a la forma que
     espera D3 mediante `toHierarchyData()`.

4. **Verificación visual con visualgo.net.**
   - Puedes comparar la estructura resultante insertando la misma
     secuencia de números en https://visualgo.net/en/bst y comparando el
     árbol dibujado allí contra el de esta app (mismos valores → misma
     forma, ya que ambos son BST clásicos sin balanceo).

## Cómo correrlo

```bash
npm install
npm start        # equivalente a: ng serve
```

Abre `http://localhost:4200`.

## Pruebas unitarias

```bash
npm test          # ng test (Karma/Jasmine)
```

Incluye pruebas para inserción, los tres recorridos, `contains()` y la
conversión a datos jerárquicos para D3 (`src/app/binary-search-tree.spec.ts`).

## Build de producción

```bash
npm run build
```

## Estructura relevante

```
src/app/
├── binary-search-tree.ts        # Modelo BST: insert, contains, traversals
├── binary-search-tree.spec.ts   # Pruebas unitarias
├── app.component.ts/.html/.css  # UI principal (inputs, recorridos, búsqueda)
└── tree-view/
    ├── tree-view.component.ts   # Visualización con d3-hierarchy / d3.tree
    ├── tree-view.component.html
    └── tree-view.component.css
```
