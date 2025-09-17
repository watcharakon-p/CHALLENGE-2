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
      <div className="p-4">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          onResult={setSearchResults}
        />
      </div>

      {searchResults.length > 0 && (
        <div className="p-4">
          <h3>Search Results:</h3>
          {searchResults.map((result) => (
            <div key={result.id}>
              <h4>{result.name}</h4>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
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
      </div>
    </div>
  );
}
