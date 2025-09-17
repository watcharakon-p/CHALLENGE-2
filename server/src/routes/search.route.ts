import { Router } from "express";
import { prisma } from "../db";

export const searchRouter = Router();

searchRouter.get("/api/search", async (req, res) => {
  const q = String(req.query.q ?? "").trim();
  const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 100)));
  if (!q) return res.json([]);

  const hits = (await prisma.$queryRawUnsafe(
    `WITH RECURSIVE r AS (
      SELECT id, name, "parentId", sort,
      jsonb_build_array(jsonb_build_object('id', id, 'name', name)) AS path
      FROM "Node" WHERE name ILIKE '%' || $1 || '%'
      UNION ALL
      SELECT n.id, n.name, n."parentId", n.sort,
      r.path || jsonb_build_object('id', n.id, 'name', n.name)
      FROM r JOIN "Node" n ON r."parentId" = n.id
      )
      SELECT (path->0->>'id') AS id, (path->0->>'name') AS name, path
      FROM r WHERE "parentId" IS NULL
      ORDER BY sort ASC
      LIMIT $2;`,
    q,
    limit
  )) as any[];

  res.json(
    hits.map((h) => ({ id: String(h.id), name: String(h.name), path: h.path }))
  );
});
