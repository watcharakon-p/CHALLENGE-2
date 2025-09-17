import { Router } from "express";
import { seedDatabase } from "../seed/seed-database";

export const seedRouter = Router();

seedRouter.post("/dev/seed", async (req, res) => {
  const breadth = Math.min(50, Math.max(1, Number(req.query.breadth ?? 20)));
  const depth = Math.min(10, Math.max(0, Number(req.query.depth ?? 6)));
  const result = await seedDatabase({ breadth, depth, cap: 50000 });
  res.json({ ok: true, ...result, breadth, depth });
});
    