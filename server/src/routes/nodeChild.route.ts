import { Router } from "express";
import { prisma } from "../db";

export const nodeChildRouter = Router();

nodeChildRouter.get("/api/nodes/:id/children", async (req, res) => {
  const id = String(req.params.id);
  const rows = await prisma.node.findMany({
    where: { parentId: id },
    orderBy: [{ sort: "asc" }],
  });
  res.json(rows);
});
