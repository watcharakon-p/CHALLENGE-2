import { Router } from "express";
import { prisma } from "../db";

export const nodeRootRouter = Router();

nodeRootRouter.get("/api/nodes/root", async (req, res) => {
  const roots = await prisma.node.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });
  res.json(roots);
});
