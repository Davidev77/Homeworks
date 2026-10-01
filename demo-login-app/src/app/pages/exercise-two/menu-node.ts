/**
 * Nodo de un árbol N-ario (cada nodo puede tener 0..N hijos).
 * Representa un ítem de menú:
 *  - title: texto visible del ítem.
 *  - link: ruta a la que navega (solo tiene sentido en nodos hoja, es decir, ítems sin submenú).
 *  - component: nombre del componente que se debe renderizar para ese link.
 *  - children: submenús (si existen, el ítem se comporta como un desplegable en vez de un enlace).
 */
export class MenuNode {
  title: string;
  link?: string;
  component?: string;
  children: MenuNode[];

  constructor(
    title: string,
    options: { link?: string; component?: string } = {},
  ) {
    this.title = title;
    this.link = options.link;
    this.component = options.component;
    this.children = [];
  }

  // Agrega uno o varios hijos a este nodo y devuelve el nodo (para encadenar)
  addChild(...children: MenuNode[]): MenuNode {
    this.children.push(...children);
    return this;
  }

  // true si el nodo tiene submenú (no es un enlace final)
  get hasChildren(): boolean {
    return this.children.length > 0;
  }
}

/**
 * Árbol N-ario del menú completo. La raíz es un nodo "virtual" (invisible
 * en la UI) cuyos hijos son las secciones de primer nivel (Profile,
 * Messages, Settings, Help, Logout, ...).
 */
export class MenuTree {
  root: MenuNode = new MenuNode('__root__');

  // Agrega ítems de primer nivel al árbol
  addTopLevel(...nodes: MenuNode[]): void {
    this.root.addChild(...nodes);
  }

  // Recorre el árbol completo (DFS) y devuelve todos los nodos hoja (los que tienen link+component)
  getAllLeaves(): MenuNode[] {
    const leaves: MenuNode[] = [];
    const traverse = (node: MenuNode) => {
      if (!node.hasChildren && node.link) {
        leaves.push(node);
      }
      node.children.forEach(traverse);
    };
    this.root.children.forEach(traverse);
    return leaves;
  }

  // Imprime el árbol en consola de forma indentada (útil para depurar la estructura N-aria)
  printToConsole(): void {
    const traverse = (node: MenuNode, depth: number) => {
      const indent = '  '.repeat(depth);
      const suffix = node.link ? ` -> ${node.link} (${node.component})` : '';
      console.log(`${indent}- ${node.title}${suffix}`);
      node.children.forEach((child) => traverse(child, depth + 1));
    };
    this.root.children.forEach((node) => traverse(node, 0));
  }
}
