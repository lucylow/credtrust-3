import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IExecDemoStepper } from '@/components/iexec-demo/Stepper';
import { TeeJobMonitor } from '@/components/tee-monitor/Monitor';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { iexecClient } from '@/lib/iexec-client';
import { Shield, Zap, Mail, Database, Terminal } from 'lucide-react';

const STEPS = [
  'Connect Wallet',
  'Initialize TEE',
  'Compute Credit Score',
  'Generate ZK Proof',
  'Web3Mail Notification',
  'Complete'
];

export default function IExecDemo() {
  const [currentStep, setCurrentStep] = useState(0);
  const [taskId, setTaskId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startDemo = async () => {
    setIsProcessing(true);
    
    // Step 0: Connect (already connected in real app)
    setCurrentStep(0);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 1: Initialize
    setCurrentStep(1);
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 2: Compute
    setCurrentStep(2);
    setTaskId('0x7d9f2a4e8b1c6d3f0a9e8d7c6b5a4f3e2d1c0b9a');
    
    // Simulate iExec processing delay
    await new Promise(r => setTimeout(r, 4000));
    
    // Step 3: ZK Proof
    setCurrentStep(3);
    await new Promise(r => setTimeout(r, 2000));
    
    // Step 4: Web3Mail
    setCurrentStep(4);
    await new Promise(r => setTimeout(r, 2000));
    
    // Step 5: Complete
    setCurrentStep(5);
    setIsProcessing(false);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Interactive iExec TEE Demo
        </h1>
        <p className="text-slate-400 text-lg">
          Experience the full lifecycle of a privacy-preserving credit score computation.
        </p>
      </motion.div>

      <div className="grid gap-8">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Process Status
            </CardTitle>
            <CardDescription>
              Real-time monitoring of the iExec SGX Enclave.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IExecDemoStepper currentStep={currentStep} steps={STEPS} />
            {taskId && <TeeJobMonitor taskId={taskId} />}
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-800 pt-6">
            {!isProcessing && currentStep === 0 && (
              <Button size="lg" onClick={startDemo} className="bg-blue-600 hover:bg-blue-700">
                <Zap className="mr-2 h-4 w-4" />
                Run Full Stack Demo
              </Button>
            )}
            {currentStep === 5 && (
              <div className="text-center">
                <p className="text-emerald-400 font-medium mb-4 flex items-center justify-center gap-2">
                  <Database className="w-4 h-4" />
                  Full iExec stack demo complete!
                </p>
                <Button variant="outline" onClick={() => {setCurrentStep(0); setTaskId('');}}>
                  Reset Demo
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Web3Mail Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              Confidential notification sent to user via iExec Web3Mail without exposing their actual email address.
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Enclave Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400">
              Hardware-level attestation ensures the credit model was executed exactly as programmed inside the TEE.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
