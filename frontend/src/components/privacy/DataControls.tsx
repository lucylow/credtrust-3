import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Trash2, Download, Eye, EyeOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function DataControls() {
  const [anonymizeData, setAnonymizeData] = useState(true);
  const [autoRevokeTokens, setAutoRevokeTokens] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete all privacy data? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all user's privacy data
      const { error: tokensError } = await supabase
        .from('disclosure_tokens')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      const { error: attestationsError } = await supabase
        .from('attestations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const { error: jobsError } = await supabase
        .from('privacy_jobs')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (tokensError || attestationsError || jobsError) {
        throw new Error('Failed to delete some data');
      }

      toast.success('All privacy data deleted');
    } catch (error) {
      toast.error('Failed to delete data', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      const { data: jobs } = await supabase.from('privacy_jobs').select('*');
      const { data: tokens } = await supabase.from('disclosure_tokens').select('*');
      const { data: attestations } = await supabase.from('attestations').select('*');

      const exportData = {
        exportedAt: new Date().toISOString(),
        privacyJobs: jobs || [],
        disclosureTokens: tokens || [],
        attestations: attestations || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privacy-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Export failed', { 
        description: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-secondary/10">
          <Settings className="h-5 w-5 text-secondary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Data Controls</h3>
      </div>

      <div className="space-y-4">
        {/* Anonymization Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-3">
            {anonymizeData ? (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            ) : (
              <Eye className="h-5 w-5 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium text-foreground">Anonymize Metadata</p>
              <p className="text-xs text-muted-foreground">
                Replace PII with zero-knowledge hashes
              </p>
            </div>
          </div>
          <Switch checked={anonymizeData} onCheckedChange={setAnonymizeData} />
        </div>

        {/* Auto-Revoke Tokens */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Auto-Revoke Tokens</p>
              <p className="text-xs text-muted-foreground">
                Revoke expired disclosure tokens automatically
              </p>
            </div>
          </div>
          <Switch checked={autoRevokeTokens} onCheckedChange={setAutoRevokeTokens} />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" className="flex-1 gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export All Data
          </Button>
          <Button
            variant="destructive"
            className="flex-1 gap-2"
            onClick={handleDeleteAll}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete All Data'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
