import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Play, Download, CheckCircle2, Clock } from 'lucide-react';

const MOCK_USERS = Array.from({ length: 10 }, (_, i) => ({
  id: `user_${i + 1}`,
  address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  status: 'idle',
  score: null,
}));

export default function BulkScore() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [isProcessing, setIsProcessing] = useState(false);

  const runBulkScoring = async () => {
    setIsProcessing(true);
    
    // Simulate parallel TEE processing
    for (let i = 0; i < users.length; i++) {
      setUsers(prev => prev.map((u, idx) => 
        idx === i ? { ...u, status: 'processing' } : u
      ));
      
      // Artificial delay to show parallelism/staggered start
      await new Promise(r => setTimeout(r, 200));
    }

    // Simulate completion
    await new Promise(r => setTimeout(r, 3000));
    
    setUsers(prev => prev.map(u => ({
      ...u,
      status: 'completed',
      score: Math.floor(Math.random() * (850 - 600) + 600)
    })));
    
    setIsProcessing(false);
  };

  const getTier = (score: number) => {
    if (score >= 750) return 'A';
    if (score >= 700) return 'B';
    if (score >= 650) return 'C';
    return 'D';
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Bulk Credit Scoring</h1>
          <p className="text-slate-400">Process hundreds of users simultaneously using iExec's distributed workerpools.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={runBulkScoring} 
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Run Bulk TEE Jobs
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">User ID</TableHead>
                <TableHead className="text-slate-400">Wallet Address</TableHead>
                <TableHead className="text-slate-400">TEE Status</TableHead>
                <TableHead className="text-slate-400">Credit Score</TableHead>
                <TableHead className="text-slate-400">Risk Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-300">{user.id}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{user.address}</TableCell>
                    <TableCell>
                      {user.status === 'idle' && (
                        <Badge variant="secondary" className="bg-slate-800 text-slate-400">Idle</Badge>
                      )}
                      {user.status === 'processing' && (
                        <Badge variant="secondary" className="bg-blue-900/50 text-blue-400 animate-pulse">
                          <Clock className="w-3 h-3 mr-1" />
                          Processing
                        </Badge>
                      )}
                      {user.status === 'completed' && (
                        <Badge variant="default" className="bg-emerald-900/50 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.score ? (
                        <span className="font-bold text-white">{user.score}</span>
                      ) : (
                        <span className="text-slate-600">--</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.score ? (
                        <Badge className={
                          getTier(user.score) === 'A' ? 'bg-emerald-500' :
                          getTier(user.score) === 'B' ? 'bg-blue-500' :
                          getTier(user.score) === 'C' ? 'bg-yellow-500' : 'bg-red-500'
                        }>
                          Tier {getTier(user.score)}
                        </Badge>
                      ) : (
                        <span className="text-slate-600">--</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
