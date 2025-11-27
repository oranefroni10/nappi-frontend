import React, { useState } from 'react';

const UserProfile: React.FC = () => {
  const [parentName, setParentName] = useState('Oran');
  const [babyName, setBabyName] = useState('Noa');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User profile saved', { parentName, babyName, notificationsEnabled });
  };

  return (
    <div>
      <h2>User & Baby Profile</h2>

      <form
        onSubmit={handleSave}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 320 }}
      >
        <label>
          Parent name:
          <input
            type="text"
            value={parentName}
            onChange={e => setParentName(e.target.value)}
          />
        </label>

        <label>
          Baby name:
          <input
            type="text"
            value={babyName}
            onChange={e => setBabyName(e.target.value)}
          />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={e => setNotificationsEnabled(e.target.checked)}
          />
          Enable notifications
        </label>

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default UserProfile;
