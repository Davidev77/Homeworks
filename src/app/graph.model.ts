export interface City {
  id: string;
  name: string;
}

export interface Person {
  id: string;
  name: string;
  age: number;
  cityId: string; // cada persona referencia a una única ciudad mediante su id
}

export type NodeKind = 'person' | 'city';

export interface GraphNode {
  id: string;
  label: string;
  kind: NodeKind;
  cityId?: string; // solo para las personas
}

export interface GraphLink {
  source: string; // person id
  target: string; // city id
}
