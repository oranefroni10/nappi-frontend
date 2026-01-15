import React, { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../types/auth';
import { authApi, babiesApi } from '../api/auth';
import { useLayoutContext } from '../components/LayoutContext';
import { fetchVapidKey, fetchPushStatus, subscribeToPush, unsubscribeFromPush } from '../api/alerts';

// Helper function to convert VAPID key to Uint8Array
const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// Helper function to calculate age from birthdate
const calculateAge = (birthdate: string): string => {
  const birth = new Date(birthdate);
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());

  if (months < 1) {
    const days = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days`;
  } else if (months < 24) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
};

const UserProfile: React.FC = () => {
  const { setMenuOpen } = useLayoutContext();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushConfigured, setPushConfigured] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Baby notes state
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nappi_user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      // Initialize notes from stored user data
      if (userData.baby?.notes) {
        setNotes(userData.baby.notes);
      }
    }
  }, []);

  // Fetch notes from server when user loads
  const fetchNotes = useCallback(async () => {
    if (!user?.user_id || !user?.baby?.id) return;
    
    try {
      const { data } = await babiesApi.getNotes(user.baby.id, user.user_id);
      setNotes(data.notes || '');
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  }, [user?.user_id, user?.baby?.id]);

  useEffect(() => {
    if (user?.baby?.id) {
      fetchNotes();
    }
  }, [user?.baby?.id, fetchNotes]);

  // Save baby notes
  const handleSaveNotes = async () => {
    if (!user?.user_id || !user?.baby?.id) return;
    
    setNotesLoading(true);
    setNotesSaved(false);
    
    try {
      await babiesApi.updateNotes(user.baby.id, user.user_id, notes);
      setNotesSaved(true);
      
      // Update local storage with new notes
      const stored = localStorage.getItem('nappi_user');
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.baby) {
          userData.baby.notes = notes;
          localStorage.setItem('nappi_user', JSON.stringify(userData));
        }
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  // Check push notification status when user loads
  const checkPushStatus = useCallback(async () => {
    if (!user?.user_id) return;
    
    try {
      const [vapidResponse, statusResponse] = await Promise.all([
        fetchVapidKey(),
        fetchPushStatus(user.user_id),
      ]);
      
      setPushConfigured(vapidResponse.configured);
      setNotificationsEnabled(statusResponse.subscribed);
    } catch (err) {
      console.error('Failed to check push status:', err);
    }
  }, [user?.user_id]);

  useEffect(() => {
    if (user?.user_id) {
      checkPushStatus();
    }
  }, [user?.user_id, checkPushStatus]);

  // Handle push notification toggle
  const handlePushToggle = async (enabled: boolean) => {
    if (!user?.user_id || pushLoading) return;
    
    setPushLoading(true);
    setPushError(null);

    try {
      if (enabled) {
        // Request permission and subscribe
        const permission = await Notification.requestPermission();
        
        if (permission !== 'granted') {
          setPushError('Please allow notifications in your browser settings');
          setPushLoading(false);
          return;
        }

        // Get VAPID key
        const vapidResponse = await fetchVapidKey();
        if (!vapidResponse.public_key) {
          setPushError('Push notifications not configured on server');
          setPushLoading(false);
          return;
        }

        // Register service worker and get subscription
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidResponse.public_key),
        });

        // Send subscription to backend
        const subscriptionJson = subscription.toJSON();
        await subscribeToPush(user.user_id, {
          endpoint: subscriptionJson.endpoint!,
          keys: {
            p256dh: subscriptionJson.keys!.p256dh,
            auth: subscriptionJson.keys!.auth,
          },
        });

        setNotificationsEnabled(true);
      } else {
        // Unsubscribe
        await unsubscribeFromPush(user.user_id);
        setNotificationsEnabled(false);
      }
    } catch (err) {
      console.error('Failed to toggle push notifications:', err);
      setPushError('Failed to update notification settings');
    } finally {
      setPushLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    // 1. Basic Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!user) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // 3. API Call
      const { data } = await authApi.changePassword({
        user_id: user.user_id,
        old_password: currentPassword,
        new_password: newPassword,
      });

      // 4. Handle Success
      if (data.password_changed) {
        setSuccess('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError('Failed to update password.');
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;

      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        const firstError = detail[0];
        const fieldName = firstError.loc?.[1] || 'Field';
        setError(`${fieldName}: ${firstError.msg}`);
      } else {
        setError('Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const babyAge = user?.baby?.birthdate ? calculateAge(user.baby.birthdate) : null;

  return (
    <>
      {/* Header Section */}
      <section className="pt-6 px-5 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer rounded-full hover:bg-gray-50 transition-colors" onClick={() => setMenuOpen(true)}>
              <img className="[border:none] p-0 bg-[transparent] w-12 h-[37px] relative" alt="Menu" src="/hugeicons-menu-02.svg" />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-semibold font-[Kodchasan] text-[#000] m-0">Profile</h1>
          </div>

          <img src="/logo.svg" alt="Nappi" className="w-12 h-12" />
        </div>
      </section>

      {/* Main Content */}
      <section className="px-5 pb-8 relative z-10">
        <div className="flex flex-col gap-5">
          {/* User Info Card with Change Password */}
          {user && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#000] mb-4 font-kodchasan flex items-center gap-2">Account Information</h3>

              <div className="flex flex-col gap-3">
                <ProfileRow label="Full Name" value={`${user.first_name} ${user.last_name}`} />
                <ProfileRow label="User Name" value={user.username || 'Unknown'} />

                {/* Change Password Toggle Section */}
                <div className="border-gray-100 mt-1 pt-1">
                  <button onClick={() => setIsChangePasswordOpen(!isChangePasswordOpen)} className="w-full flex justify-between items-center py-2 text-left rounded-lg">
                    <span className="text-gray-600 text-sm hover:text-gray-900 transition-colors">Change Password</span>
                    <span className={`text-gray-400 text-xs transition-transform duration-300 ${isChangePasswordOpen ? 'rotate-180' : ''}`}>▼</span>
                  </button>

                  {/* Expandable Password Form */}
                  {isChangePasswordOpen && (
                    <div className="flex flex-col gap-3 mt-2 pl-1 pr-1 pb-1" style={{ animation: 'slideDown 0.3s ease-out' }}>
                      {/* Status Messages */}
                      {error && <div className="text-red-500 text-xs px-1">{error}</div>}
                      {success && <div className="text-green-500 text-xs px-1">{success}</div>}

                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/50 transition-all placeholder:text-gray-400"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/50 transition-all placeholder:text-gray-400"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4ECDC4]/50 transition-all placeholder:text-gray-400"
                      />

                      <button
                        onClick={handleUpdatePassword}
                        disabled={loading}
                        className={`w-full mt-2 text-white font-medium py-2.5 rounded-xl shadow-sm transition-all ${
                          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#4ECDC4] hover:bg-[#3dbdb5] hover:shadow-md active:scale-[0.98]'
                        }`}
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <style>{`
                @keyframes slideDown {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>
          )}

          {/* Baby Info Card */}
          {user?.baby && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-[#000] mb-4 font-kodchasan flex items-center gap-2">Baby Information</h3>

              <div className="flex flex-col gap-3">
                <ProfileRow label="Name" value={`${user.baby.first_name} ${user.baby.last_name}`} />
                <ProfileRow label="Age" value={babyAge || 'Unknown'} />
                <ProfileRow label="Birthdate" value={new Date(user.baby.birthdate).toLocaleDateString()} />
              </div>
              
              {/* Notes Section */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <label className="block text-gray-600 text-sm mb-1">Notes about your baby</label>
                <p className="text-xs text-gray-400 mb-2">Allergies, health conditions, or anything the AI should know</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., lactose intolerant, eczema, prefers white noise..."
                  maxLength={2000}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all duration-200 focus:border-[#4ECDC4] focus:ring-2 focus:ring-[#4ECDC4]/20 focus:bg-white resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{notes.length}/2000</span>
                  <div className="flex items-center gap-2">
                    {notesSaved && (
                      <span className="text-xs text-green-500">Saved!</span>
                    )}
                    <button
                      onClick={handleSaveNotes}
                      disabled={notesLoading}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        notesLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#4ECDC4] hover:bg-[#3dbdb5] text-white shadow-sm hover:shadow-md active:scale-[0.98]'
                      }`}
                    >
                      {notesLoading ? 'Saving...' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#000] mb-4 font-kodchasan flex items-center gap-2">Settings</h3>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <div>
                <p className="m-0 font-medium text-gray-700">Push Notifications</p>
                <p className="m-0 mt-1 text-xs text-gray-400">
                  {!pushConfigured 
                    ? 'Not configured on server'
                    : notificationsEnabled 
                    ? 'Enabled - get alerts when baby wakes up'
                    : 'Disabled - tap to enable alerts'}
                </p>
                {pushError && (
                  <p className="m-0 mt-1 text-xs text-red-500">{pushError}</p>
                )}
              </div>
              <ToggleSwitch 
                enabled={notificationsEnabled} 
                onChange={handlePushToggle}
                disabled={pushLoading || !pushConfigured}
              />
            </div>
            
            {pushLoading && (
              <p className="text-xs text-gray-400 mt-2">Updating notification settings...</p>
            )}
          </div>

          {/* App Info */}
          <p className="text-center text-gray-400 text-xs mt-4">Nappi v1.0.0 • Made with 💛 for better baby sleep</p>
        </div>
      </section>
    </>
  );
};

const ProfileRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-[#000] font-medium text-sm">{value}</span>
  </div>
);

const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}> = ({ enabled, onChange, disabled }) => (
  <button
    onClick={() => !disabled && onChange(!enabled)}
    disabled={disabled}
    className={`w-[50px] h-7 rounded-full border-none relative transition-all ${enabled ? 'bg-green-500' : 'bg-gray-300'} ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    }`}
  >
    <div className={`w-[22px] h-[22px] rounded-full bg-white absolute top-[3px] transition-all shadow-md ${enabled ? 'left-[25px]' : 'left-[3px]'}`} />
  </button>
);

export default UserProfile;
