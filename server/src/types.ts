export type NodeRow = {
  id: string;
  parentId: string | null;
  name: string;
  hasChildren: boolean;
  sort: number;
};

export type SearchHit = {
  id: string;
  name: string;
  path: Array<{ id: string; name: string }>;
};

export type SeedOpts = {
  breadth: number;
  depth: number;
  cap?: number;
};
