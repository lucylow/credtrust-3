import React, { useState } from 'react';

interface TelegramCampaignComposerProps {
  onSend: (content: string) => void;
}

export const TelegramCampaignComposer: React.FC<TelegramCampaignComposerProps> = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSend(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-lg font-medium mb-2">Compose Campaign</h3>
      <textarea
        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        rows={4}
        placeholder="Enter your message here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        disabled={!content.trim()}
      >
        Send Campaign
      </button>
    </form>
  );
};

export default TelegramCampaignComposer;
