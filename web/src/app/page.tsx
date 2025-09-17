"use client"

import TreeView from "@/components/TreeView";
import { NodeRow } from "@/types/types";

const nodeLabel = (node: NodeRow) => {
  return (
    <span className="text-blue-500">
      Folder {node.name}
    </span>
  )
}


export default function Home() {
  return (
    <div className="space-y-4">
      <div className="max-w-md mx-auto mt-10 border rounded-lg shadow-lg">
        <TreeView renderLabel={nodeLabel} />
      </div>
    </div>
  );
}
