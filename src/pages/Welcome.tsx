import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      background: 'linear-gradient(to bottom, #FFE4E1 0%, #E6F7FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3rem 1.5rem 2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <h1 style={{ 
        fontSize: '1.8rem', 
        margin: 0,
        color: '#333',
        fontWeight: '400'
      }}>
        Welcome To
      </h1>
      
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Placeholder for logo - add your actual logo image here */}
        <div style={{
          width: '120px',
          height: '120px',
          background: '#B4E7E5',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <span style={{ fontSize: '3rem' }}>👶</span>
        </div>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          color: '#333'
        }}>
          nappi
        </h2>
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <p style={{ 
          fontSize: '1rem', 
          color: '#666', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Better sleep for your baby<br />and for you
        </p>

        <button
          onClick={() => navigate('/login')}
          style={{
            background: '#FFD166',
            border: 'none',
            borderRadius: '50px',
            padding: '1rem',
            width: '100%',
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#333',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          let&apos;s nap!
        </button>
      </div>
    </div>
  );
};

export default Welcome;

