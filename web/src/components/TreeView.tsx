"use client"

import { NodeRow, SearchHit, TreeState } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { getChildrenOnce, getRoots } from "@/lib/api";
import SearchBox from "./SearchBox";
import SubTree from "./SubTree";

export default function TreeView({renderLabel}: {renderLabel: (node: NodeRow) => React.ReactNode}) {

  const [rootIds, setRootIds] = useState<string[]>([]);
  const [state, setState] = useState<TreeState>({
    nodes: new Map<string, NodeRow>(),
    expandedNodes: new Set<string>(),
    childrenMap: new Map<string, string[]>(),
    parentMap: new Map<string, string | null>(),
    isLoadingChildren: new Set<string>(),
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchHit[]>([]);

  useEffect(() => {
    async function fetchRoots() {
      try{
        const rootNodes = await getRoots();
        setState((s:TreeState) => {
          const newNodes = new Map(s.nodes);
          rootNodes.forEach((n) => newNodes.set(n.id,n));
          return {
            ...s,
            nodes: newNodes,
          }
        })
        setRootIds(rootNodes.map(row => row.id));
      }catch(err){
        console.error("Failed to fetch roots", err);
      }
    }
    fetchRoots();
  }, []);


  const onToggle = useCallback(
    async (id: string) => {
      const isCurrentExpanded = state.expandedNodes.has(id);
      const hasChildrenLoaded = state.childrenMap.has(id);

      if(!isCurrentExpanded && !hasChildrenLoaded){
        setState((s:TreeState) => {
          const newExpandedNodes = new Set(s.expandedNodes);
          newExpandedNodes.add(id);
          return {
            ...s,
            expandedNodes: newExpandedNodes,
          }
        })

        try {
          const children = await getChildrenOnce(id);
  
          setState((s:TreeState) => {
            const newNodes = new Map(s.nodes);
            children.forEach((n) => newNodes.set(n.id,n));
  
            const newChildrenMap = new Map(s.childrenMap);
            newChildrenMap.set(id, children.map(row => row.id));
  
            const newLoading = new Set(s.isLoadingChildren);
            newLoading.delete(id);
  
            const newExpanded = new Set(s.expandedNodes).add(id);
  
            return {
              ...s,
              nodes: newNodes,
              childrenMap: newChildrenMap,
              isLoadingChildren: newLoading,
              expandedNodes: newExpanded,
            }
          })
  
        }catch(err){
          console.error("Failed to toggle", err);
          setState((s:TreeState) => {
            const newLoading = new Set(s.isLoadingChildren);
            newLoading.delete(id);
            return {
              ...s,
              isLoadingChildren: newLoading,
            }
          })
        }
      }else{
        setState((s:TreeState) => {
          const newExpandedNodes = new Set(s.expandedNodes);
          
          if(isCurrentExpanded){
            newExpandedNodes.delete(id);
          }else{
            newExpandedNodes.add(id);
          }

          return {
            ...s,
            expandedNodes: newExpandedNodes,
          }
        })
      }
    },
    [state.expandedNodes,state.childrenMap]
  );

  return (
    <div className="font-sans">
      <section className="border-b border-foreground/10 bg-background/60 p-4">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          onResult={setSearchResults}
        />
      </section>

      {searchResults.length > 0 && (
        <section className="px-4 py-3">
          <h3 className="mb-2 text-sm font-medium text-foreground/70">Search Results</h3>
          <ul className="divide-y divide-foreground/10 overflow-hidden rounded-md border border-foreground/10 bg-background">
            {searchResults.map((result) => (
              <li key={result.id} className="group flex items-center justify-between gap-3 px-3 py-2 hover:bg-foreground/[0.04]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{result.name}</p>
                  {result.path?.length > 0 && (
                    <p className="truncate text-xs text-foreground/60">
                      {result.path.map(p => p.name).join(" / ")}
                    </p>
                  )}
                </div>
                <span className="ml-2 text-xs text-foreground/50">#{result.id}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="p-2 sm:p-4">
        {rootIds.map((id) => (
          <SubTree
            key={id}
            id={id}
            depth={0}
            state={state}
            renderLabel={renderLabel}
            onToggle={onToggle}
          />
        ))}
      </section>
    </div>
  );
}

