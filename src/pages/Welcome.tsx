import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FFE4E1 0%, #E8F4FD 50%, #E6F7FF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '3rem 1.5rem 2.5rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-5%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'rgba(180, 231, 229, 0.3)',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '-10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(255, 209, 102, 0.2)',
        filter: 'blur(50px)'
      }} />

      {/* Top Section */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <p style={{ 
          fontSize: '1.1rem', 
          margin: 0,
          color: '#6B7280',
          fontWeight: '400',
          letterSpacing: '0.5px'
        }}>
          Welcome to
        </p>
      </div>
      
      {/* Center - Logo */}
      <div style={{ 
        textAlign: 'center', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        zIndex: 1
      }}>
        <div style={{
          width: '140px',
          height: '140px',
          background: 'linear-gradient(135deg, #B4E7E5 0%, #7DD3C8 100%)',
          borderRadius: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          boxShadow: '0 20px 40px rgba(125, 211, 200, 0.3)',
          transform: 'rotate(-3deg)'
        }}>
          <span style={{ fontSize: '4rem', transform: 'rotate(3deg)' }}>👶</span>
        </div>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '700', 
          margin: '0 0 0.5rem 0',
          color: '#1F2937',
          letterSpacing: '-1px'
        }}>
          nappi
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6B7280',
          margin: 0,
          maxWidth: '280px',
          lineHeight: '1.5'
        }}>
          Better sleep for your baby,<br />and peace of mind for you
        </p>
      </div>

      {/* Bottom - CTA Buttons */}
      <div style={{ width: '100%', maxWidth: '360px', zIndex: 1 }}>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: 'linear-gradient(135deg, #FFD166 0%, #FFB84D 100%)',
            border: 'none',
            borderRadius: '16px',
            padding: '1.1rem',
            width: '100%',
            fontSize: '1.15rem',
            fontWeight: '600',
            color: '#1F2937',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(255, 209, 102, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            marginBottom: '1rem'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 209, 102, 0.4)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 209, 102, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 209, 102, 0.4)';
          }}
        >
          Get Started
        </button>

        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: '16px',
            padding: '1rem',
            width: '100%',
            fontSize: '1rem',
            fontWeight: '500',
            color: '#4B5563',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#FFD166';
            e.currentTarget.style.color = '#1F2937';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E5E7EB';
            e.currentTarget.style.color = '#4B5563';
          }}
        >
          I already have an account
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9CA3AF',
          marginTop: '1.5rem',
          marginBottom: 0
        }}>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Welcome;
