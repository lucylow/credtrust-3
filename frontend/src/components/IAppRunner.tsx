// src/components/IAppRunner.tsx
import React, { useState } from "react";
import axios from "axios";

type SubmitResponse = { taskId?: string; status?: string; message?: string };

const IAppRunner: React.FC = () => {
  const [protectedData, setProtectedData] = useState("");
  const [app, setApp] = useState(import.meta.env.VITE_IEXEC_APP_ADDRESS || "");
  const [args, setArgs] = useState("");
  const [inputFiles, setInputFiles] = useState("");
  const [secrets, setSecrets] = useState("");
  const [tag, setTag] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  async function submitRun() {
    setStatus("submitting...");
    try {
      const body = {
        protectedData,
        app,
        args,
        inputFiles: inputFiles ? inputFiles.split(",").map(s => s.trim()).filter(Boolean) : [],
        secrets, // raw "1:secret,2:other"
        tag
      };
      // POST to server endpoint that will call scripts/run_iapp_with_protected_data.ts
      const resp = await axios.post("/api/iapp/run", body);
      const data: SubmitResponse = resp.data;
      setTaskId(data.taskId || null);
      setStatus("submitted: " + (data.message || data.taskId));
    } catch (e: any) {
      setStatus("error: " + (e.message || JSON.stringify(e)));
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">Run iApp with ProtectedData</h3>
      <input className="border p-2 w-full mt-2" placeholder="protectedData address" value={protectedData} onChange={e => setProtectedData(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder="app (optional)" value={app} onChange={e => setApp(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder='args e.g. "--input-path data/input.csv --output-format json"' value={args} onChange={e => setArgs(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder="inputFiles (comma separated URLs)" value={inputFiles} onChange={e => setInputFiles(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder='secrets e.g. "1:openai-api-key,2:db-pass"' value={secrets} onChange={e => setSecrets(e.target.value)} />
      <input className="border p-2 w-full mt-2" placeholder="tag (optional)" value={tag} onChange={e => setTag(e.target.value)} />
      <div className="mt-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={submitRun}>Submit iApp Run</button>
      </div>
      <div className="mt-2 text-sm text-gray-600">Status: {status}</div>
      {taskId && <div className="mt-2 text-xs">TaskId: <span className="font-mono">{taskId}</span></div>}
    </div>
  );
};

export default IAppRunner;
