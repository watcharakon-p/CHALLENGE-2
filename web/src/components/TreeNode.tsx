import { TreeNodeProps } from "@/types/types";

const Spiner = () => (
  <div className="animate-spin h-5 w-5 border-b-2 border-gray-900"></div>
);

export default function TreeNode({
  node,
  depth,
  isExpanded,
  isLoadingChildren,
  onToggle,
  renderLabel,
}: TreeNodeProps) {
  const handleToggle = () => {
    if (node.hasChildren) {
      onToggle(node.id);
    }
  };

  return (
    <div className="flex items-center gap-2" style={{ paddingLeft: `${depth * 25}px` }}>
      <span
        className="w-6 h-6 flex items-center justify-center cursor-pointer"
        onClick={handleToggle}
      >
        {isLoadingChildren ? (<Spiner />) : node.hasChildren ? (isExpanded ? "-" : "+") : null}
      </span>
      <div className="flex-grow p-1">{renderLabel(node)}</div>
    </div>
  );
}
