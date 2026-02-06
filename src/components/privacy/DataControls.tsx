import { motion } from 'framer-motion';
import { Settings, Trash2, Download, Eye, EyeOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { usePrivacyStore } from '@/store/privacyStore';
import { toast } from 'sonner';

export default function DataControls() {
  const {
    anonymizeData,
    toggleAnonymize,
    autoRevokeTokens,
    toggleAutoRevoke,
    deleteAllData,
  } = usePrivacyStore();

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete all privacy data? This cannot be undone.')) {
      deleteAllData();
      toast.success('All privacy data deleted');
    }
  };

  const handleExport = () => {
    toast.success('Exporting data...', { description: 'Your data export is being prepared.' });
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
          <Switch checked={anonymizeData} onCheckedChange={toggleAnonymize} />
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
          <Switch checked={autoRevokeTokens} onCheckedChange={toggleAutoRevoke} />
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
          >
            <Trash2 className="h-4 w-4" />
            Delete All Data
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
