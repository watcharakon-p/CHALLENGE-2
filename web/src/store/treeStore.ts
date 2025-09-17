import { NodeRow } from "@/types/types";
import { getChildrenOnce } from "@/lib/api";

type TreeState = {
  nodes: Map<string, NodeRow>;
  expandedNodes: Set<string>;
  childrenMap: Map<string, string[]>;
  parentMap: Map<string, string | null>;

  setRoots(roots: NodeRow[]): void;
  toggle(id: string): Promise<void>;
  expandPath(id: string): void;
  ensureLoaded(id: string): Promise<void>;
};

export function useTreeStore(): TreeState {

  const nodes  = new Map<string, NodeRow>();
  const expandedNodes = new Set<string>();
  const childrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string | null>();

  const api: TreeState = {
    nodes,
    expandedNodes,
    childrenMap,
    parentMap,

    setRoots(roots){
      for(const root of roots){
        nodes.set(root.id, root);
        parentMap.set(root.id, null);
      }
    },
    async ensureLoaded(id){
      const node = nodes.get(id);
      
      if(!node || node.hasChildren) return;
      if(childrenMap.has(id)) return;
      
      const rows = await getChildrenOnce(id);
      childrenMap.set(id, rows.map(row => row.id));

      for(const row of rows){
        nodes.set(row.id, row);
        parentMap.set(row.id, id);
      }
    },  
    async toggle(id){
      if(expandedNodes.has(id)){
        expandedNodes.delete(id);
      }else{
        await api.ensureLoaded(id);
        expandedNodes.add(id);
      }
    },
    expandPath(ids){
      for(const id of ids){
        expandedNodes.add(id);
      }
    },
  };

  return api;
}
