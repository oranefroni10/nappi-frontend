import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { AuthUser } from '../types/auth';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<AuthUser | null>(null);

  const [babyName, setBabyName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.registerBaby({
        user_id: user.user_id,
        first_name: babyName,
        birthdate,
        gender: gender || undefined,
      });

      localStorage.setItem('nappi_user', JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        baby_id: data.baby_id,
        baby: data.baby,
      }));

      navigate('/');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to register baby');
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

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#7DD3C8';
    e.target.style.boxShadow = '0 0 0 3px rgba(125, 211, 200, 0.2)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#E5E7EB';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem',
      background: 'linear-gradient(160deg, #E0F7F5 0%, #E8F4FD 50%, #E6F7FF 100%)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '100px',
          height: '100px',
          background: 'linear-gradient(135deg, #B4E7E5 0%, #7DD3C8 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          fontSize: '3rem',
          boxShadow: '0 12px 32px rgba(125, 211, 200, 0.35)'
        }}>
          👶
        </div>
        <h2 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.75rem',
          color: '#1F2937',
          fontWeight: '700'
        }}>
          Almost there!
        </h2>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          color: '#6B7280',
          maxWidth: '300px'
        }}>
          {user ? `Hi ${user.username}! Let's add your baby to start monitoring` : 'Loading...'}
        </p>
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
              Baby&apos;s First Name
            </label>
            <input
              type="text"
              required
              value={babyName}
              onChange={e => setBabyName(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Enter baby's name"
              style={inputStyle}
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
              Birthdate
            </label>
            <input
              type="date"
              required
              value={birthdate}
              onChange={e => setBirthdate(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
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
              Gender <span style={{ color: '#9CA3AF', fontWeight: '400' }}>(optional)</span>
            </label>
            <select
              value={gender}
              onChange={e => setGender(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
            >
              <option value="">Prefer not to say</option>
              <option value="male">Boy 👦</option>
              <option value="female">Girl 👧</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading 
                ? '#E5E7EB' 
                : 'linear-gradient(135deg, #7DD3C8 0%, #5BC4B6 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: loading ? '#9CA3AF' : 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(125, 211, 200, 0.4)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Setting up...' : 'Start Monitoring 🚀'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9CA3AF',
          marginTop: '1.5rem',
          marginBottom: 0
        }}>
          You can update this information anytime in settings
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
