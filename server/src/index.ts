import express from "express";
import cors from "cors";
import { searchRouter } from "./routes/search.route";
import { nodeRootRouter } from "./routes/nodeRoot.route";
import { nodeChildRouter } from "./routes/nodeChild.route";
import { seedRouter } from "./routes/seed.route";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use(seedRouter);
app.use(searchRouter);
app.use(nodeRootRouter);
app.use(nodeChildRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use((_, res) => res.status(404).json({ ok: false, error: "Not Found" }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: any, res: any, _next: any) =>
    res.status(500).json({ ok: false, error: "Internal Error" })
);

app.listen(port, () => {
    console.log(`[api] Server is running on port ${port}`);
});