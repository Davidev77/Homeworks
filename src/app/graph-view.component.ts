import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef,
  effect, inject, input, signal, viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { GraphLink, GraphNode } from './graph.model';

interface SimNode extends d3.SimulationNodeDatum, GraphNode {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {}

const PAD = 50; 

@Component({
  selector: 'app-graph-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg #svg></svg>`,
  styles: [`
    :host { position: absolute; inset: 0; display: block; }
    svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  `],
})
export class GraphViewComponent {
  nodes = input.required<GraphNode[]>();
  links = input.required<GraphLink[]>();
  highlightCityId = input<string | null>(null);

  private svgRef = viewChild<ElementRef<SVGSVGElement>>('svg');
  private size = signal({ w: 0, h: 0 });
  private positions = new Map<string, { x: number; y: number }>();
  private simulation?: d3.Simulation<SimNode, SimLink>;
  private resizeObserver?: ResizeObserver;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.simulation?.stop();
      this.resizeObserver?.disconnect();
    });

    effect(() => {
      const svgEl = this.svgRef()?.nativeElement;
      if (!svgEl) return;

      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() =>
          this.size.set({ w: svgEl.clientWidth, h: svgEl.clientHeight })
        );
        this.resizeObserver.observe(svgEl);
      }

      const { w, h } = this.size();
      if (!w || !h) return; 
      this.render(svgEl, w, h, this.nodes(), this.links(), this.highlightCityId());
    });
  }

  private render(
    svgEl: SVGSVGElement, width: number, height: number,
    nodes: GraphNode[], links: GraphLink[], highlight: string | null
  ) {
    this.simulation?.stop();
    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const cx = width / 2;
    const cy = height / 2;

    const simNodes: SimNode[] = nodes.map((n) => {
      const pos = this.positions.get(n.id) ?? {
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 80,
      };
      return { ...n, ...pos };
    });
    const simLinks: SimLink[] = links.map((l) => ({ source: l.source, target: l.target }));

    const isDimmed = (n: SimNode) =>
      !!highlight && (n.kind === 'city' ? n.id !== highlight : n.cityId !== highlight);

    const link = svg.append('g').attr('stroke', '#9aa5b1').attr('stroke-width', 1.5)
      .selectAll('line').data(simLinks).join('line');

    const node = svg.append('g').selectAll<SVGGElement, SimNode>('g').data(simNodes).join('g')
      .attr('opacity', (d) => (isDimmed(d) ? 0.25 : 1))
      .style('cursor', 'grab');

    node.append('circle')
      .attr('r', (d) => (d.kind === 'city' ? 26 : 14))
      .attr('fill', (d) => (d.kind === 'city' ? '#1f6f78' : '#e9a23b'))
      .attr('stroke', (d) => (highlight && !isDimmed(d) ? '#111' : '#fff'))
      .attr('stroke-width', 2);

    node.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.kind === 'city' ? 42 : 30))
      .attr('font-size', (d) => (d.kind === 'city' ? 13 : 11))
      .attr('font-weight', (d) => (d.kind === 'city' ? 600 : 400))
      .attr('fill', 'currentColor');

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

    this.simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink<SimNode, SimLink>(simLinks).id((d) => d.id).distance(90))
      .force('charge', d3.forceManyBody().strength(-220))
      .force('x', d3.forceX(cx).strength(0.08))
      .force('y', d3.forceY(cy).strength(0.08))
      .force('collide', d3.forceCollide(38))
      .on('tick', () => {
        simNodes.forEach((n) => {
          n.x = clamp(n.x ?? cx, PAD, width - PAD);
          n.y = clamp(n.y ?? cy, PAD, height - PAD);
          this.positions.set(n.id, { x: n.x, y: n.y });
        });
        link
          .attr('x1', (d) => (d.source as SimNode).x!).attr('y1', (d) => (d.source as SimNode).y!)
          .attr('x2', (d) => (d.target as SimNode).x!).attr('y2', (d) => (d.target as SimNode).y!);
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

    const sim = this.simulation;
    node.call(
      d3.drag<SVGGElement, SimNode>()
        .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (e, d) => { d.fx = clamp(e.x, PAD, width - PAD); d.fy = clamp(e.y, PAD, height - PAD); })
        .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );
  }
}