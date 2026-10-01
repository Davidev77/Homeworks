// Nodo del árbol binario de búsqueda (BST)

export class TreeNode {
  value: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(value: number) {
    this.value = value;
  }
}

export interface BinarySearchTreeHierarchy {
  value: number;
  children?: BinarySearchTreeHierarchy[];
}

/**
 *   Árbol Binario de Búsqueda (Binary Search Tree)
 *
 *   insert(value): inserta un nuevo valor respetando la propiedad BST
 *   (izquierda < nodo < derecha)
 *   contains(value): indica si un valor existe en el árbol
 *   inOrder / preOrder / postOrder: recorridos clásicos, imprimen por consola
 *   y también devuelven el arreglo resultante
 */
export class BinarySearchTree {
  root: TreeNode | null = null;

  /** Inserta valores en el árbol */
  insert(...values: number[]): void {
    for (const value of values) {
      this.root = this.insertNode(this.root, value);
    }
  }

  private insertNode(node: TreeNode | null, value: number): TreeNode {
    if (node === null) {
      return new TreeNode(value);
    }

    if (value < node.value) {
      node.left = this.insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.insertNode(node.right, value);
    }
    // Si value === node.value, no se insertan duplicados

    return node;
  }

  /* Función para verificar si un valor está en el árbol */
  contains(value: number): boolean {
    return this.containsNode(this.root, value);
  }

  private containsNode(node: TreeNode | null, value: number): boolean {
    if (node === null) {
      return false;
    }
    if (value === node.value) {
      return true;
    }
    return value < node.value
      ? this.containsNode(node.left, value)
      : this.containsNode(node.right, value);
  }

  /* Recorrido InOrder (izquierda, raíz, derecha) */
  inOrder(): number[] {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /* Recorrido PreOrder (raíz, izquierda, derecha) */
  preOrder(): number[] {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      result.push(node.value);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /* Recorrido PostOrder (izquierda, derecha, raíz) */
  postOrder(): number[] {
    const result: number[] = [];
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push(node.value);
    };
    traverse(this.root);
    return result;
  }

  /* Imprime los 3 recorridos por consola */
  printTraversalsToConsole(): void {
    console.log('InOrder:   ', this.inOrder().join(', '));
    console.log('PreOrder:  ', this.preOrder().join(', '));
    console.log('PostOrder: ', this.postOrder().join(', '));
  }

  /**
   * Convierte el árbol a una estructura jerárquica plana, apta para
   * d3.hierarchy(). Cada nodo expone { value, children: [...] }.
   */
  toHierarchyData(): BinarySearchTreeHierarchy | null {
    const convert = (node: TreeNode): BinarySearchTreeHierarchy => {
      const children = [node.left, node.right]
        .filter((child): child is TreeNode => child !== null)
        .map(convert);

      return children.length > 0
        ? { value: node.value, children }
        : { value: node.value };
    };

    return this.root ? convert(this.root) : null;
  }
}
