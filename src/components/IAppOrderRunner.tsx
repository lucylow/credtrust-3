// src/components/IAppOrderRunner.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function IAppOrderRunner() {
  const [app, setApp] = useState(import.meta.env.VITE_IEXEC_APP_ADDRESS || "");
  const [workerpool, setWorkerpool] = useState(import.meta.env.VITE_IEXEC_WORKERPOOL || "");
  const [args, setArgs] = useState("");
  const [inputFiles, setInputFiles] = useState("");
  const [secrets, setSecrets] = useState("");
  const [status, setStatus] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);

  async function submit() {
    setStatus("submitting...");
    try {
      const body = {
        app,
        workerpool,
        args,
        inputFiles: inputFiles ? inputFiles.split(",").map(s=>s.trim()) : [],
        secrets
      };
      const res = await axios.post("/api/iapp/run", body);
      setStatus("submitted: " + JSON.stringify(res.data.matchRes || res.data));
      loadTasks();
    } catch (e: any) {
      setStatus("error: " + (e.message || JSON.stringify(e)));
    }
  }

  async function loadTasks() {
    try {
      const res = await axios.get("/api/iapp/tasks");
      setTasks(res.data || []);
    } catch (e) {
      console.error("Failed to load tasks", e);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  return (
    <div className="p-4 border rounded space-y-3 bg-card text-card-foreground shadow-sm">
      <h3 className="font-bold text-lg">Run iApp (no ProtectedData)</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">App Address</label>
        <input placeholder="0x..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={app} onChange={e=>setApp(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Workerpool (optional)</label>
        <input placeholder="0x..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={workerpool} onChange={e=>setWorkerpool(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Args (CLI string)</label>
        <input placeholder="--param value" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={args} onChange={e=>setArgs(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Input Files (comma separated URLs)</label>
        <input placeholder="https://..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={inputFiles} onChange={e=>setInputFiles(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Secrets (e.g. "1:openai-key")</label>
        <input placeholder='1:key,2:val' className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" value={secrets} onChange={e=>setSecrets(e.target.value)} />
      </div>
      
      <div className="flex gap-2 mt-4">
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" onClick={submit}>Submit Run</button>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" onClick={loadTasks}>Refresh Tasks</button>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Local tasks</h4>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks found.</p>}
          {tasks.map((t: any, i: number) => (
            <div key={i} className="p-3 border rounded bg-muted/50">
              <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
              <pre className="mt-2 text-xs overflow-x-auto p-2 bg-black/5 rounded text-black/80">{JSON.stringify(t.matchRes, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs font-mono bg-muted p-2 rounded truncate">
        Status: {status}
      </div>
    </div>
  );
}
