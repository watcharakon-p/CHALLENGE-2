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
    sort: number;
  }> = [];
  // Use realistic top-level folders for a file explorer
  const defaultRoots = [
    "Documents",
    "Downloads",
    "Pictures",
    "Music",
    "Videos",
    "Desktop",
    "Projects",
    "Workspace",
    "Archives",
    "Temp",
  ];
  const roots: string[] = [];
  const rootCount = Math.min(breadth, defaultRoots.length, 50);
  for (let i = 0; i < rootCount && toInsert.length < cap; i++) {
    const id = mkId();
    roots.push(id);
    toInsert.push({
      id,
      parentId: null,
      name: defaultRoots[i % defaultRoots.length] ?? `Root ${i + 1}`,
      hasChildren: depth > 0,
      sort: i,
    });
  }

  const q: Array<{ id: string; level: number }> = roots.map((id) => ({
    id,
    level: 1,
  }));

  while (q.length && toInsert.length < cap) {
    const { id: parentId, level } = q.shift()!;
    if (level > depth) continue;
    // Decide how many folders vs files to create at this level
    const isLeafLevel = level >= depth;
    const folderTarget = isLeafLevel ? 0 : Math.max(1, Math.ceil(breadth * 0.5));
    const fileTarget = isLeafLevel ? breadth : Math.max(0, breadth - folderTarget);

    // Maintain a per-parent sort index so folders and files share one sequence
    let sortIndex = 0;

    // Create subfolders
    for (let i = 0; i < folderTarget && toInsert.length < cap; i++) {
      const id = mkId();
      const name = `Folder ${level}-${i + 1}`; // no slashes, folder-like naming
      const hasChildren = level < depth; // folders can have children until depth
      toInsert.push({ id, parentId, name, hasChildren, sort: sortIndex++ });
      if (hasChildren) q.push({ id, level: level + 1 });
    }

    // Create files for this folder
    const fileExtensions = [
      "txt",
      "md",
      "pdf",
      "png",
      "jpg",
      "svg",
      "json",
      "ts",
      "tsx",
      "js",
      "csv",
      "zip",
    ];
    for (let i = 0; i < fileTarget && toInsert.length < cap; i++) {
      const id = mkId();
      const ext = fileExtensions[i % fileExtensions.length] ?? "txt";
      const name = `file_${level}-${i + 1}.${ext}`; // files never have children
      toInsert.push({ id, parentId, name, hasChildren: false, sort: sortIndex++ });
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
