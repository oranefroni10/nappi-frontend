import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Floating chat button that appears on all pages except the chat page itself.
 * Positioned above the bottom navigation bar.
 */
const ChatFloatingButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on chat page
  if (location.pathname === '/chat') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/chat')}
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#4ECDC4] rounded-full shadow-lg flex items-center justify-center hover:bg-[#3dbdb5] transition-all z-50 hover:shadow-xl hover:scale-105 active:scale-95"
      aria-label="Open AI Chat"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
};

export default ChatFloatingButton;
