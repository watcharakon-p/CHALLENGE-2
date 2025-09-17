import { TreeNodeProps } from "@/types/types";

const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-foreground/20 border-t-blue-500" />
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`h-4 w-4 transition-transform ${open ? "rotate-90" : "rotate-0"}`}
  >
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1-1.06-1.06l4-4-4-4a.75.75 0 1 1 1.06-1.06l4.53 4.53a.75.75 0 0 1 0 1.06l-4.53 4.53Z" clipRule="evenodd" />
  </svg>
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
    <div className="group relative flex items-center gap-2 rounded-md px-1 py-1 hover:bg-foreground/[0.04]" style={{ paddingLeft: `${depth * 16 + 4}px` }}>
      {/* indentation guide */}
      {depth > 0 && (
        <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-foreground/10" />
      )}
      <button
        type="button"
        aria-label={node.hasChildren ? (isExpanded ? "Collapse" : "Expand") : "Leaf"}
        className="flex h-6 w-6 items-center justify-center rounded hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
        onClick={handleToggle}
      >
        {isLoadingChildren ? (
          <Spinner />
        ) : node.hasChildren ? (
          <Chevron open={isExpanded} />
        ) : (
          <span className="h-1 w-1 rounded-full bg-foreground/40" />
        )}
      </button>
      <div className="min-w-0 flex-grow pr-2">{renderLabel(node)}</div>
    </div>
  );
}
