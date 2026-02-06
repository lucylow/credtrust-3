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
    <div className="py-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Interactive iExec TEE Demo
        </h1>
        <p className="text-muted-foreground text-lg">
          Experience the full lifecycle of a privacy-preserving credit score computation.
        </p>
      </motion.div>

      <div className="grid gap-8 max-w-4xl mx-auto">
        <Card className="bg-card/50 border-border backdrop-blur-sm shadow-xl">
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
          <CardFooter className="justify-center border-t border-border pt-6">
            {!isProcessing && currentStep === 0 && (
              <Button size="lg" onClick={startDemo} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => {setCurrentStep(0); setTaskId('');}}>
                    Reset Demo
                  </Button>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <a href="/app">Go to Main App</a>
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 font-bold">
                <Mail className="w-4 h-4 text-purple-400" />
                Web3Mail Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Confidential notification sent to user via iExec Web3Mail without exposing their actual email address.
            </CardContent>
          </Card>
          <Card className="bg-card border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 font-bold">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Enclave Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Hardware-level attestation ensures the credit model was executed exactly as programmed inside the TEE.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
