import { BinarySearchTree } from './binary-search-tree';

describe('BinarySearchTree', () => {
  let tree: BinarySearchTree;

  beforeEach(() => {
    tree = new BinarySearchTree();
    tree.insert(50, 30, 70, 20, 40, 60, 80);
  });

  it('inserts values respecting BST order (inOrder is sorted)', () => {
    expect(tree.inOrder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it('computes preOrder correctly', () => {
    expect(tree.preOrder()).toEqual([50, 30, 20, 40, 70, 60, 80]);
  });

  it('computes postOrder correctly', () => {
    expect(tree.postOrder()).toEqual([20, 40, 30, 60, 80, 70, 50]);
  });

  it('contains() finds existing values', () => {
    expect(tree.contains(40)).toBeTrue();
    expect(tree.contains(80)).toBeTrue();
    expect(tree.contains(50)).toBeTrue();
  });

  it('contains() returns false for missing values', () => {
    expect(tree.contains(999)).toBeFalse();
    expect(tree.contains(-1)).toBeFalse();
  });

  it('handles an empty tree', () => {
    const empty = new BinarySearchTree();
    expect(empty.inOrder()).toEqual([]);
    expect(empty.contains(1)).toBeFalse();
    expect(empty.toHierarchyData()).toBeNull();
  });

  it('builds hierarchy data usable by d3.hierarchy', () => {
    const data = tree.toHierarchyData();
    expect(data.value).toBe(50);
    expect(data.children?.length).toBe(2);
  });
});
