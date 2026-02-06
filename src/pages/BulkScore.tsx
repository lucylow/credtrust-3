import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Play, Download, CheckCircle2, Clock } from 'lucide-react';

const MOCK_USERS = Array.from({ length: 25 }, (_, i) => ({
  id: `user_${i + 1}`,
  address: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
  status: Math.random() > 0.8 ? 'completed' : 'idle',
  score: Math.random() > 0.8 ? Math.floor(Math.random() * (850 - 600) + 600) : null,
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
    <div className="py-4 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bulk Credit Scoring</h1>
          <p className="text-muted-foreground">Process hundreds of users simultaneously using iExec's distributed workerpools.</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={runBulkScoring} 
            disabled={isProcessing}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
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

      <Card className="bg-card border-border">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User ID</TableHead>
                <TableHead className="text-muted-foreground">Wallet Address</TableHead>
                <TableHead className="text-muted-foreground">TEE Status</TableHead>
                <TableHead className="text-muted-foreground">Credit Score</TableHead>
                <TableHead className="text-muted-foreground">Risk Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">{user.id}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{user.address}</TableCell>
                    <TableCell>
                      {user.status === 'idle' && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">Idle</Badge>
                      )}
                      {user.status === 'processing' && (
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 animate-pulse border-blue-500/20">
                          <Clock className="w-3 h-3 mr-1" />
                          Processing
                        </Badge>
                      )}
                      {user.status === 'completed' && (
                        <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.score ? (
                        <span className="font-bold text-foreground">{user.score}</span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
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
                        <span className="text-muted-foreground">--</span>
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
