import React from 'react';

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: 'Baby woke up',
    message: 'Baby was awake for 5 minutes at 03:12.',
    createdAt: new Date().toISOString(),
    severity: 'info',
  },
  {
    id: 2,
    title: 'Room temperature high',
    message: 'Temperature reached 26°C at 15:42.',
    createdAt: new Date().toISOString(),
    severity: 'warning',
  },
];

const severityColor: Record<NotificationItem['severity'], string> = {
  info: '#0077ff',
  warning: '#ff9800',
  critical: '#f44336',
};

const Notifications: React.FC = () => {
  return (
    <div>
      <h2>Notifications</h2>
      <p>Recent alerts and messages from the system.</p>

      <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '1rem' }}>
        {MOCK_NOTIFICATIONS.map(n => (
          <li
            key={n.id}
            style={{
              border: '1px solid #ddd',
              borderLeft: `4px solid ${severityColor[n.severity]}`,
              padding: '0.5rem 0.75rem',
              marginBottom: '0.5rem',
              borderRadius: 4,
            }}
          >
            <strong>{n.title}</strong>
            <p style={{ margin: '0.25rem 0' }}>{n.message}</p>
            <small style={{ color: '#666' }}>
              {new Date(n.createdAt).toLocaleString()} – {n.severity.toUpperCase()}
            </small>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        (Mock data for Sprint 1 – will be powered by real backend events later.)
      </p>
    </div>
  );
};

export default Notifications;
