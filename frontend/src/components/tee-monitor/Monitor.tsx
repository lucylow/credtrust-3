import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { getIExecExplorerUrl } from '@/lib/iexec-client';

interface TeeJob {
  taskId: string;
  status: 'CREATED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  score?: number;
  mrenclave?: string;
}

export function TeeJobMonitor({ taskId }: { taskId: string }) {
  const [job, setJob] = useState<TeeJob | null>(null);

  useEffect(() => {
    if (!taskId) return;
    
    // In a real app, this would be an API call to a backend that polls iExec
    // For this demo, we simulate polling
    const pollJob = async () => {
      // Mocking iExec status response
      const statuses: TeeJob['status'][] = ['CREATED', 'RUNNING', 'COMPLETED'];
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setJob({
          taskId,
          status: statuses[currentIndex],
          score: currentIndex === 2 ? 785 : undefined,
          mrenclave: '0xabc...123'
        });
        
        if (currentIndex === 2) clearInterval(interval);
        currentIndex++;
      }, 3000);
      
      return () => clearInterval(interval);
    };

    pollJob();
  }, [taskId]);

  if (!taskId) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-mono text-slate-400">
            TEE Task: {taskId.slice(0, 12)}...
          </CardTitle>
          <a 
            href={getIExecExplorerUrl('task', taskId)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 uppercase">Status</span>
              <Badge variant={job?.status === 'COMPLETED' ? 'default' : 'secondary'} className="w-fit mt-1">
                {job?.status || 'INITIALIZING'}
              </Badge>
            </div>
            {job?.score && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex flex-col"
              >
                <span className="text-xs text-slate-500 uppercase">Computed Score</span>
                <span className="text-2xl font-bold text-green-400">{job.score}</span>
              </motion.div>
            )}
            {job?.mrenclave && (
              <div className="col-span-2 flex flex-col mt-2">
                <span className="text-xs text-slate-500 uppercase">Enclave Proof (MRENCLAVE)</span>
                <span className="text-xs font-mono text-blue-400 break-all">{job.mrenclave}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
