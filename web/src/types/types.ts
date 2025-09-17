export interface NodeRow {
  id: string;
  name: string;
  parentId: string | null;
  hasChildren: boolean;
}

export interface SearchHit {
  id: string;
  name: string;
  path: Array<{id: string, name: string}>;
}


export interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onResult: (results: SearchHit[]) => void;
}

export interface TreeNodeProps {
  node: NodeRow;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
  isLoadingChildren: boolean;
  onToggle: (id: string) => void;
  renderLabel: (node: NodeRow) => React.ReactNode;
}

export interface TreeState {
  nodes: Map<string, NodeRow>;
  expandedNodes: Set<string>;
  isLoadingChildren: Set<string>;
  childrenMap: Map<string, string[]>;
  parentMap: Map<string, string | null>;
}

export interface SubTreeProps {
  id: string;
  depth: number;
  state: TreeState;
  renderLabel: (node: NodeRow) => React.ReactNode;
  onToggle: (id: string) => void;
}

  