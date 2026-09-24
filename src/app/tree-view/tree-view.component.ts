import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';

interface BstHierarchyDatum {
  value: number;
  children?: BstHierarchyDatum[];
}

/*Dibuja un árbol binario de búsqueda usando el módulo d3-hierarchy (https://d3js.org/d3-hierarchy/tree)*/
@Component({
  selector: 'app-tree-view',
  standalone: true,
  imports: [],
  templateUrl: './tree-view.component.html',
  styleUrl: './tree-view.component.css',
})
export class TreeViewComponent implements AfterViewInit, OnChanges {
  /* Datos jerárquicos: { value, children: [...] } o null si el árbol está vacío. */
  @Input() data: BstHierarchyDatum | null = null;

  @ViewChild('container', { static: true })
  container!: ElementRef<HTMLDivElement>;

  private viewInitialized = false;

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewInitialized) {
      this.render();
    }
  }

  private render(): void {
    const host = this.container.nativeElement;
    host.innerHTML = ''; // limpia el render anterior

    if (!this.data) {
      return;
    }

    const width = host.clientWidth || 800;
    const nodeRadius = 20;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    // d3.hierarchy() convierte nuestros datos anidados en una jerarquía D3
    const root = d3.hierarchy<BstHierarchyDatum>(
      this.data,
      (d) => d.children,
    );

    const depth = root.height + 1;
    const height = Math.max(depth * 100, 200);

    // d3.tree() calcula la posición (x, y) de cada nodo en la jerarquía
    const treeLayout = d3
      .tree<BstHierarchyDatum>()
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ]);

    const treeData = treeLayout(root);

    const svg = d3
      .select(host)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Enlaces (edges) entre nodo padre e hijo, usando d3.linkVertical()
    const linkGenerator = d3
      .linkVertical<
        d3.HierarchyPointLink<BstHierarchyDatum>,
        d3.HierarchyPointNode<BstHierarchyDatum>
      >()
      .x((d) => d.x)
      .y((d) => d.y);

    g.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .selectAll('path')
      .data(treeData.links())
      .join('path')
      .attr('d', linkGenerator as any);

    // Nodos
    const node = g
      .append('g')
      .selectAll('g')
      .data(treeData.descendants())
      .join('g')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);

    node
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', (d) => (d.depth === 0 ? '#2563eb' : '#38bdf8'))
      .attr('stroke', '#1e3a8a')
      .attr('stroke-width', 1.5);

    node
      .append('text')
      .attr('dy', '0.32em')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '13px')
      .attr('font-weight', 600)
      .text((d) => d.data.value);
  }
}
