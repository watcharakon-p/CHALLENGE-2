"use client"

import TreeView from "@/components/TreeView";
import { NodeRow } from "@/types/types";

const nodeLabel = (node: NodeRow) => {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-foreground/90">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200">
        📁
      </span>
      <span className="font-medium truncate max-w-[240px]" title={node.name}>{node.name}</span>
      {node.hasChildren && (
        <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600 ring-1 ring-inset ring-blue-200">
          Folder
        </span>
      )}
    </span>
  )
}


export default function Home() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tree Explorer</h1>
        <p className="text-sm text-foreground/60 mt-1">Browse and search nodes with a clean, modern UI.</p>
      </header>

      <div className="rounded-xl border border-foreground/10 bg-background shadow-sm ring-1 ring-black/5">
        <TreeView renderLabel={nodeLabel} />
      </div>
    </div>
  );
}
