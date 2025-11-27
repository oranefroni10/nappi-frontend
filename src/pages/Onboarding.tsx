import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const [email, setEmail] = useState('');
  const [babyName, setBabyName] = useState('');
  const [babyAge, setBabyAge] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Onboarding submitted:', { email, babyName, babyAge });
    navigate('/');
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '2rem 1rem'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#B4E7E5',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2.5rem'
        }}>
          👶
        </div>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.5rem',
          color: '#1F2937'
        }}>
          Welcome to Nappi!
        </h2>
        <p style={{ 
          margin: 0, 
          fontSize: '0.875rem',
          color: '#6B7280'
        }}>
          Let&apos;s set up your baby&apos;s profile to get started
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.25rem'
        }}
      >
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Parent Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FFD166'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Baby Name
          </label>
          <input
            type="text"
            required
            value={babyName}
            onChange={e => setBabyName(e.target.value)}
            placeholder="Enter baby's name"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FFD166'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>

        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '500',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Baby Age (months)
          </label>
          <input
            type="number"
            required
            min="0"
            max="36"
            value={babyAge}
            onChange={e => setBabyAge(e.target.value)}
            placeholder="e.g., 2"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #D1D5DB',
              fontSize: '1rem',
              boxSizing: 'border-box',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FFD166'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>

        <button 
          type="submit"
          style={{
            background: '#FFD166',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: '#333',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 2px 8px rgba(255, 209, 102, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 209, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 209, 102, 0.3)';
          }}
        >
          Continue to Dashboard
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        fontSize: '0.75rem',
        color: '#9CA3AF',
        marginTop: '2rem'
      }}>
        You can update this information later in your profile
      </p>
    </div>
  );
};

export default Onboarding;
