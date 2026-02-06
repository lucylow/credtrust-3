import { useEffect, useState } from 'react';
import TelegramContactList from '../components/TelegramContactList';
import TelegramCampaignComposer from '../components/TelegramCampaignComposer';

export default function TelegramDemo() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/telegram/contacts/me')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContacts(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSendCampaign = async (content: string) => {
    console.log('Sending campaign with content:', content);
    // Implementation of campaign sending would go here
    // For demo purposes, we'll just log it
    alert(`Campaign message prepared: "${content}" for ${contacts.length} contacts.`);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">CredTrust – Web3Telegram Demo</h1>
      
      <div className="space-y-6">
        <section className="bg-white shadow rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Privacy-Preserving Messaging</h2>
          <p className="text-gray-600 mb-4">
            Telegram Chat IDs are never revealed. They are stored as ProtectedData on-chain.
          </p>
          
          {loading ? (
            <p className="text-blue-500 animate-pulse">Loading contacts...</p>
          ) : (
            <TelegramContactList contacts={contacts} />
          )}
        </section>

        <section className="bg-white shadow rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Bulk Campaigns</h2>
          <TelegramCampaignComposer onSend={handleSendCampaign} />
        </section>

        <section className="bg-blue-50 rounded-lg p-6 border border-blue-100">
          <h3 className="text-blue-800 font-semibold mb-2">Governance & Security</h3>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Users control permissions via DataProtector</li>
            <li>Messaging is confidential and revocable</li>
            <li>Fully compatible with TEE, PoCo, and Arbitrum</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
