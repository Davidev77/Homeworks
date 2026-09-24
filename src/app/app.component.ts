import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BinarySearchTree } from './binary-search-tree';
import { TreeViewComponent } from './tree-view/tree-view.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, TreeViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Árbol Binario de Búsqueda + D3';

  tree = new BinarySearchTree();

  /* Valores separados por coma que el usuario escribe para insertar en lote */
  bulkInput = '50, 30, 70, 20, 40, 60, 80, 10, 25';

  /* Valor individual a insertar */
  singleValue: number | null = null;

  /* Valor a buscar con contains() */
  searchValue: number | null = null;
  searchResult: boolean | null = null;

  inOrderResult: number[] = [];
  preOrderResult: number[] = [];
  postOrderResult: number[] = [];

  /* Datos jerárquicos para pasarle al componente D3, se reasigna para disparar el redibujado */
  hierarchyData: any = null;

  constructor() {
    this.insertBulk();
  }

  /* Inserta la lista de números separados por coma del campo de texto */
  insertBulk(): void {
    const values = this.bulkInput
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .map(Number)
      .filter((v) => !Number.isNaN(v));

    if (values.length === 0) {
      return;
    }

    this.tree.insert(...values);
    this.refresh();
  }

  /* Inserta un único valor desde el input dedicado */
  insertSingle(): void {
    if (this.singleValue === null || Number.isNaN(this.singleValue)) {
      return;
    }
    this.tree.insert(this.singleValue);
    this.singleValue = null;
    this.refresh();
  }

  /* Usa BinarySearchTree.contains() */
  runSearch(): void {
    if (this.searchValue === null || Number.isNaN(this.searchValue)) {
      this.searchResult = null;
      return;
    }
    this.searchResult = this.tree.contains(this.searchValue);
    console.log(
      `¿El valor ${this.searchValue} está en el árbol?`,
      this.searchResult,
    );
  }

  /* Reinicia el árbol por completo */
  resetTree(): void {
    this.tree = new BinarySearchTree();
    this.refresh();
  }

  /* Recalcula recorridos, imprime en consola y actualiza los datos para D3 */
  private refresh(): void {
    this.tree.printTraversalsToConsole();

    this.inOrderResult = this.tree.inOrder();
    this.preOrderResult = this.tree.preOrder();
    this.postOrderResult = this.tree.postOrder();

    // Nueva referencia de objeto para que Angular detecte el cambio (@Input)
    this.hierarchyData = this.tree.toHierarchyData();
  }
}
