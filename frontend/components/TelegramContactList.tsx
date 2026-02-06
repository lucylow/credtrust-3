import React from 'react';

interface Contact {
  protectedData: string;
  owner: string;
}

interface TelegramContactListProps {
  contacts: Contact[];
}

export const TelegramContactList: React.FC<TelegramContactListProps> = ({ contacts }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-2">Contacts</h3>
      {contacts.length === 0 ? (
        <p className="text-gray-500">No contacts available.</p>
      ) : (
        <div className="bg-gray-50 rounded-md p-4">
          {contacts.map((contact) => (
            <div key={contact.protectedData} className="border-b last:border-b-0 py-2">
              <p className="text-sm font-semibold">{contact.owner}</p>
              <p className="text-xs text-gray-500 truncate">{contact.protectedData}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TelegramContactList;
