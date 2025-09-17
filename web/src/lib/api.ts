import { NodeRow, SearchHit } from "@/types/types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const childCache = new Map<string, Promise<NodeRow[]>>();

export async function getRoots(): Promise<NodeRow[]> {
  const res = await fetch(`${BASE}/api/nodes/root`);
  if (!res.ok) {
    throw new Error("Failed to fetch roots");
  }
  return res.json() as Promise<NodeRow[]>;
}

export async function getChildrenOnce(id: string): Promise<NodeRow[]> {
  
  if(!childCache.has(id)){
    const p = await fetch(`${BASE}/api/nodes/${id}/children`).then(res => {
      if (!res.ok) throw new Error("Failed to fetch children");
      return res.json();
    }).catch(err => {
      childCache.delete(id);
      throw err;
    });
    childCache.set(id, p);
  }

  return childCache.get(id)!;
}


export async function search(q: string, limit = 100): Promise<SearchHit[]> {

  if(!q.trim()) return [];
  const query = encodeURIComponent(q);

  const res = await fetch(`${BASE}/api/search?q=${query}&limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to search");
  }
  return res.json() as Promise<SearchHit[]>;
}