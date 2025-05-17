import React from 'react';
import { AuthProvider } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface OAuthButtonsProps {
  mode: 'login' | 'signup';
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ mode }) => {
  const { signIn, loading } = useAuth();

  const handleOAuthSignIn = async (provider: AuthProvider) => {
    await signIn(provider);
  };

  const buttonText = mode === 'login' ? 'Log in with' : 'Sign up with';

  return (
    <div className="flex flex-col space-y-3 w-full">
      <button
        onClick={() => handleOAuthSignIn('google')}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-70"
      >
        <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
        <span>{buttonText} Google</span>
      </button>
      
      <button
        onClick={() => handleOAuthSignIn('github')}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
      >
        <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" />
        <span>{buttonText} Github</span>
      </button>
      
      <button
        onClick={() => handleOAuthSignIn('facebook')}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1877F2] text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-70"
      >
        <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
        <span>{buttonText} Facebook</span>
      </button>
      
      <button
        onClick={() => handleOAuthSignIn('twitter')}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
      >
        <img src="/icons/twitter.svg" alt="X" className="w-5 h-5" />
        <span>{buttonText} X</span>
      </button>
    </div>
  );
};

export default OAuthButtons;
