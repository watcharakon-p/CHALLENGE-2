import { prisma } from "../db";
import { SeedOpts } from "../types";

export async function seedDatabase({ breadth, depth, cap = 50000 }: SeedOpts) {
  await prisma.$transaction([prisma.node.deleteMany()]);

  let idCounter = 0;
  const mkId = () => `n_${idCounter++}`;
  const toInsert: Array<{
    id: string;
    parentId: string | null;
    name: string;
    hasChildren: boolean;
  }> = [];

  const roots: string[] = [];
  for (let i = 0; i < Math.min(breadth, 50) && toInsert.length < cap; i++) {
    const id = mkId();
    roots.push(id);
    toInsert.push({
      id,
      parentId: null,
      name: `Root ${i + 1}`,
      hasChildren: depth > 0,
    });
  }

  const q: Array<{ id: string; level: number }> = roots.map((id) => ({
    id,
    level: 1,
  }));
  
  while (q.length && toInsert.length < cap) {
    const { id: parentId, level } = q.shift()!;
    if (level > depth) continue;
    for (let i = 0; i < breadth && toInsert.length < cap; i++) {
      const id = mkId();
      const parentName =
        toInsert.find((n) => n.id === parentId)?.name ?? "Node";
      const name = `${parentName} / Item ${i + 1}`;
      const hasChildren = level < depth;
      toInsert.push({ id, parentId, name, hasChildren });
      if (hasChildren) q.push({ id, level: level + 1 });
    }
  }

  for (let i = 0; i < toInsert.length; i += 2000) {
    await prisma.node.createMany({
      data: toInsert.slice(i, i + 2000),
      skipDuplicates: true,
    });
  }
  return { total: toInsert.length };
}

if (require.main === module) {
  const breadth = Number(process.env.SEED_BREADTH ?? 20);
  const depth = Number(process.env.SEED_DEPTH ?? 6);
  seedDatabase({ breadth, depth }).then((r) => {
    console.log("Seeded", r.total);
    process.exit(0);
  });
}
