import { SubTreeProps } from "@/types/types";
import TreeNode from "./TreeNode";

export default function SubTree({
  id,
  depth,
  state,
  renderLabel,
  onToggle,
}: SubTreeProps) {
  const node = state.nodes.get(id);

  if(!node) return null;

  const isExpanded = state.expandedNodes.has(id);
  const isLoadingChildren = state.isLoadingChildren.has(id);

  return (
    <div>
      <TreeNode
        node={node}
        depth={depth}
        hasChildren={node.hasChildren}
        isExpanded={isExpanded}
        isLoadingChildren={isLoadingChildren}
        onToggle={onToggle}
        renderLabel={renderLabel}
      />

      {isExpanded && state.childrenMap.get(id)?.map((childId) => (
        <SubTree
          key={childId}
          id={childId}
          depth={depth + 1}
          state={state}
          renderLabel={renderLabel}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
