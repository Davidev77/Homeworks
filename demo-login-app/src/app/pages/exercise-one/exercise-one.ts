import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BinarySearchTree } from './binary-search-tree';
import { TreeViewComponent } from './tree-view/tree-view.component';

@Component({
  selector: 'app-exercise-one',
  standalone: true,
  imports: [FormsModule, TreeViewComponent],
  templateUrl: './exercise-one.html',
  styleUrl: './exercise-one.css',
})
export class ExerciseOne {
  private tree = new BinarySearchTree();
  title = 'Binary Search Tree';
  bulkInput = '';
  singleValue: number | null = null;
  searchValue: number | null = null;
  searchResult: boolean | null = null;
  inputError = '';
  hierarchyData = this.tree.toHierarchyData();
  inOrderResult: number[] = [];
  preOrderResult: number[] = [];
  postOrderResult: number[] = [];

  insertBulk(): void {
    const tokens = this.bulkInput
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);
    const values = tokens.map(Number);

    if (values.length === 0 || values.some((value) => !Number.isFinite(value))) {
      this.inputError = 'Escribe uno o más números separados por comas.';
      return;
    }

    this.tree.insert(...values);
    this.bulkInput = '';
    this.refreshTree();
  }

  insertSingle(): void {
    if (this.singleValue === null || !Number.isFinite(this.singleValue)) {
      this.inputError = 'Escribe un número válido.';
      return;
    }

    this.tree.insert(this.singleValue);
    this.singleValue = null;
    this.refreshTree();
  }

  runSearch(): void {
    if (this.searchValue === null || !Number.isFinite(this.searchValue)) {
      this.searchResult = null;
      return;
    }

    this.searchResult = this.tree.contains(this.searchValue);
  }

  resetTree(): void {
    this.tree = new BinarySearchTree();
    this.bulkInput = '';
    this.singleValue = null;
    this.searchValue = null;
    this.searchResult = null;
    this.inputError = '';
    this.refreshTree();
  }

  private refreshTree(): void {
    this.hierarchyData = this.tree.toHierarchyData();
    this.inOrderResult = this.tree.inOrder();
    this.preOrderResult = this.tree.preOrder();
    this.postOrderResult = this.tree.postOrder();
    this.searchResult = null;
    this.inputError = '';
    this.tree.printTraversalsToConsole();
  }
}