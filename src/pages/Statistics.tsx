import React from 'react';

const Statistics: React.FC = () => {
  return (
    <div>
      <h2>Sleep Statistics</h2>
      <p>
        Here you&apos;ll see historical sleep trends, average sleep time,
        awakenings per night, and more.
      </p>
      <ul>
        <li>Average nightly sleep: 7h 45m</li>
        <li>Average awakenings: 2.1</li>
        <li>Best sleep quality this week: 92 / 100</li>
      </ul>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>
        (Mocked values for Sprint 1 – to be connected to real analytics later.)
      </p>
    </div>
  );
};

export default Statistics;
