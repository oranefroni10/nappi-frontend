import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import type { SignUpRequest } from '../types/auth';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<SignUpRequest>({
    username: '',
    password: '',
    repeat_password: '',
    first_name: '',
    last_name: '',
    baby_first_name: '',
    baby_birthdate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.repeat_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.signup(form);
      
      localStorage.setItem('nappi_user', JSON.stringify({
        user_id: data.user_id,
        username: data.username,
        baby_id: data.baby?.id || null,
        baby: data.baby,
      }));

      if (data.baby_registered) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } }, message?: string };
      setError(error.response?.data?.detail || error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.875rem',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#FAFAFA'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151',
    fontSize: '0.9rem',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = '#FFD166';
    e.target.style.boxShadow = '0 0 0 3px rgba(255, 209, 102, 0.2)';
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
      padding: '2rem 1.5rem',
      background: 'linear-gradient(160deg, #FFE4E1 0%, #E8F4FD 50%, #E6F7FF 100%)'
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate('/welcome')}
        style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem',
          cursor: 'pointer'
        }}
      >
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #B4E7E5 0%, #7DD3C8 100%)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 0.5rem',
          boxShadow: '0 8px 24px rgba(125, 211, 200, 0.3)'
        }}>
          <span style={{ fontSize: '1.75rem' }}>👶</span>
        </div>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1F2937', fontWeight: '700' }}>
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
        maxWidth: '440px'
      }}>
        <h2 style={{ 
          margin: '0 0 0.5rem 0', 
          textAlign: 'center', 
          color: '#1F2937',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Create Account
        </h2>
        <p style={{
          margin: '0 0 1.5rem 0',
          textAlign: 'center',
          color: '#6B7280',
          fontSize: '0.9rem'
        }}>
          Start monitoring your baby&apos;s sleep
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Parent Info Section */}
          <div style={{
            background: '#F9FAFB',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '0.5rem'
          }}>
            <p style={{ 
              margin: '0 0 1rem 0', 
              color: '#6B7280', 
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              👤 Parent Information
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  required
                  value={form.first_name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="John"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  required
                  value={form.last_name}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Doe"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="johndoe"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Confirm</label>
                <input
                  type="password"
                  name="repeat_password"
                  required
                  value={form.repeat_password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Baby Info Section */}
          <div style={{
            background: '#F0FDF9',
            borderRadius: '16px',
            padding: '1.25rem'
          }}>
            <p style={{ 
              margin: '0 0 1rem 0', 
              color: '#047857', 
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              👶 Baby Information
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Baby&apos;s First Name</label>
              <input
                type="text"
                name="baby_first_name"
                required
                value={form.baby_first_name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Emma"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Baby&apos;s Birthdate</label>
              <input
                type="date"
                name="baby_birthdate"
                required
                value={form.baby_birthdate}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
              />
            </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #F3F4F6'
        }}>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
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
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
