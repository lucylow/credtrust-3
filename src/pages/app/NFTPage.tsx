import { motion } from 'framer-motion';
import CreditNFT from '@/components/app/CreditNFT';

export default function NFTPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Credit Proof NFTs</h1>
        <p className="text-muted-foreground">
          Your verified credit scores as non-transferable soulbound tokens
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreditNFT score={750} attestation="0x7a8f...3e2d" tokenId="#1247" />
        <CreditNFT score={680} attestation="0x9c3d...1f4a" tokenId="#1198" />
        <CreditNFT score={820} attestation="0x2b7e...8c5f" tokenId="#1312" />
      </div>
    </motion.div>
  );
}
