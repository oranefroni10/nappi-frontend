import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.signin({ username, password });

      localStorage.setItem('nappi_user', JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        baby_id: data.baby_id,
        baby: data.baby,
      }));

      if (data.baby_id) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#FAFAFA'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'linear-gradient(160deg, #FFE4E1 0%, #E8F4FD 50%, #E6F7FF 100%)'
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate('/welcome')}
        style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, #B4E7E5 0%, #7DD3C8 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.75rem',
          boxShadow: '0 8px 24px rgba(125, 211, 200, 0.3)'
        }}>
          <span style={{ fontSize: '2rem' }}>👶</span>
        </div>
        <h1 style={{ margin: 0, fontSize: '1.75rem', color: '#1F2937', fontWeight: '700' }}>
          nappi
        </h1>
      </div>

      {/* Card */}
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          textAlign: 'center', 
          color: '#1F2937',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Welcome back!
        </h2>
        <p style={{
          margin: '0 0 1.5rem 0',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '0.9rem'
        }}>
          Sign in to continue monitoring
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2',
            color: '#DC2626',
            padding: '0.875rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500', 
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD166';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '500', 
              color: '#374151',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#FFD166';
                e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading 
                ? '#E5E7EB' 
                : 'linear-gradient(135deg, #FFD166 0%, #FFB84D 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              color: loading ? '#9CA3AF' : '#1F2937',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 209, 102, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.75rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #F3F4F6'
        }}>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '0.9rem' }}>
            Don&apos;t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: '#3B82F6',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                padding: 0
              }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
