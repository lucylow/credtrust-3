// src/server/api/iapp.ts
import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { createAndSignRequestOrder, fetchTopAppAndWorkerpoolOrders, matchOrdersAndRun } from "../../lib/iexecOrder";

const router = express.Router();
router.use(bodyParser.json());

/**
 * POST /api/iapp/run
 * Body: { app, workerpool, args, inputFiles:[], secrets: "1:key,2:val" }
 *
 * This endpoint **calls SDK directly** (preferred) not spawn.
 * We will call createAndSignRequestOrder + fetch top orders + matchOrdersAndRun.
 */
router.post("/run", async (req, res) => {
  try {
    const { app, workerpool, args, inputFiles, secrets } = req.body;
    const secretsMap = parseSecrets(secrets);
    const createRes = await createAndSignRequestOrder({
      app: app || process.env.IEXEC_APP_ADDRESS,
      workerpool,
      args,
      inputFiles,
      secrets: secretsMap
    });
    const { requestorder, signedRequestOrder } = createRes;

    const { appOrders, workerpoolOrders } = await fetchTopAppAndWorkerpoolOrders(app, workerpool);
    const apporder = appOrders[0]?.order || null;
    const workerpoolorder = workerpoolOrders[0]?.order || null;

    const matchRes = await matchOrdersAndRun({
      requestOrderSigned: signedRequestOrder,
      appOrder: apporder,
      workerpoolOrder: workerpoolorder
    });

    // persist to tasks store
    const storePath = process.env.TASK_STORE || "./data/tasks.json";
    let arr = [];
    if (fs.existsSync(storePath)) arr = JSON.parse(fs.readFileSync(storePath, "utf8"));
    arr.push({ createdAt: new Date().toISOString(), requestorder, matchRes });
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify(arr, null, 2));

    res.json({ ok: true, matchRes });
  } catch (err: any) {
    console.error("api/iapp/run error", err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
});

router.get("/tasks", (req, res) => {
  const storePath = process.env.TASK_STORE || "./data/tasks.json";
  if (!fs.existsSync(storePath)) return res.json([]);
  const arr = JSON.parse(fs.readFileSync(storePath, "utf8"));
  res.json(arr);
});

router.get("/task/:id", (req, res) => {
  const storePath = process.env.TASK_STORE || "./data/tasks.json";
  if (!fs.existsSync(storePath)) return res.status(404).json({ error: "no task store" });
  const arr = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const t = arr.find((x: any) => JSON.stringify(x.matchRes).includes(req.params.id) || JSON.stringify(x).includes(req.params.id));
  if (!t) return res.status(404).json({ error: "task not found" });
  res.json(t);
});

function parseSecrets(secretsRaw?: any) {
  if (!secretsRaw) return undefined;
  if (typeof secretsRaw === "string") {
    const pairs = secretsRaw.split(",").map((s: string) => s.trim()).filter(Boolean);
    const o: Record<number, string> = {};
    for (const p of pairs) {
      const [k, v] = p.split(":");
      o[Number(k)] = v;
    }
    return o;
  }
  return secretsRaw;
}

export default router;
