import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Cpu, ShieldCheck, Clock, Award, AlertTriangle } from "lucide-react";
import { WorkerCapabilities, WorkerExecutionSummary } from "../workers/types";
import { TASK_CATEGORIES } from "../iexec/categories";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface WorkerInfoPanelProps {
  capabilities?: WorkerCapabilities;
  executionSummary?: WorkerExecutionSummary;
}

const WorkerInfoPanel: React.FC<WorkerInfoPanelProps> = ({ 
  capabilities, 
  executionSummary 
}) => {
  const category = executionSummary ? TASK_CATEGORIES[executionSummary.category] : null;

  return (
    <Card className="w-full bg-slate-900/50 border-slate-800 text-slate-100 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Worker Transparency
          </CardTitle>
          {capabilities?.trusted && (
            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Verified TEE
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-400">
          iExec Confidential Worker Node Status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase font-medium">Compute Power</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">{capabilities?.cpus || 2} vCPUs / {capabilities?.memoryGB || 8}GB RAM</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500 uppercase font-medium">TEE Runtime</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium">{capabilities?.tee || "SGX"} Mode</span>
            </div>
          </div>
        </div>

        {executionSummary && (
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-blue-400" />
                Execution Time
              </div>
              <span className="text-sm font-mono text-blue-300">
                {executionSummary.executionTimeMinutes.toFixed(2)} min
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Award className="w-4 h-4 text-yellow-400" />
                Worker Reward
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/20">
                {executionSummary.workerRewarded ? "RLC Earned" : "Pending"}
              </Badge>
            </div>

            {executionSummary.workerSlashed && (
              <div className="flex items-center gap-2 p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Worker stake was slashed due to integrity failure.
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-[10px] text-slate-500 cursor-help italic">
                  “Executed by an iExec worker inside a Trusted Execution Environment (TEE). Rewards and penalties enforced by PoCo.”
                </p>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700 text-slate-200 w-64">
                <p>iExec Proof-of-Contribution (PoCo) ensures that workers are rewarded only for correct computations verified by hardware attestations. Failure to provide proof results in stake slashing.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerInfoPanel;
