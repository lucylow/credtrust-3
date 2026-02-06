import { motion } from 'framer-motion';

export function FrameworkStatus() {
  const frameworks = [
    { name: 'TensorFlow 2.19.0', size: '3.01GB', status: 'live' as const, tdx: true, sgx: false },
    { name: 'PyTorch 2.7.0', size: '6.44GB', status: 'live' as const, tdx: true, sgx: false },
    { name: 'Scikit-learn 1.6.1', size: '1.18GB', status: 'live' as const, tdx: true, sgx: true },
    { name: 'OpenVINO 2024.6', size: '1.82GB', status: 'live' as const, tdx: true, sgx: false }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
        🔬 AI Frameworks Live
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {frameworks.map((fw, i) => (
          <motion.div
            key={fw.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group hover:scale-[1.02] transition-all"
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900/50 border border-white/20 hover:border-emerald-400/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">{fw.name}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  fw.status === 'live' ? 'bg-emerald-500 animate-ping' : 'bg-slate-500'
                }`} />
              </div>
              <div className="space-y-2 text-sm text-white/70 mb-4">
                <div>Size: <span className="font-mono">{fw.size}</span></div>
                <div>TDX: {fw.tdx ? '✅' : '❌'}</div>
                <div>SGX: {fw.sgx ? '✅' : '❌'}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
