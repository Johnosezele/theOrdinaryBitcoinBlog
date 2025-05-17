import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const { signIn, signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'facebook' | 'twitter') => {
    signIn(provider);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const { error: signInError } = await signInWithEmail(email, password);
      
      if (signInError) {
        throw signInError;
      }
      
      setSuccess('Signed in successfully');
      
      // Use navigate instead of window.location for proper routing
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <div className="w-full">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }}>Welcome back</h1>
          <p className="text-white" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#F02B6C] hover:underline">
              Sign up for free here
            </Link>
            .
          </p>
        </div>
        
        {!showEmailForm ? (
          <div className="space-y-3">
            {/* Google */}
            <button 
              onClick={() => handleOAuthSignIn('google')}
              className="flex items-center justify-center w-full bg-white text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-100 transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <img src="/icons/google.svg" alt="Google" className="w-5 h-5 mr-3" />
              Log in with Google
            </button>
            
            {/* GitHub */}
            <button 
              onClick={() => handleOAuthSignIn('github')}
              className="flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-900 transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5 mr-3" />
              Log in with Github
            </button>
            
            {/* Facebook */}
            {/*<button 
              onClick={() => handleOAuthSignIn('facebook')}
              className="flex items-center justify-center w-full bg-[#1877F2] text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5 mr-3" />
              Log in with Facebook
            </button>*/}
            
            {/* Twitter/X */}
            {/*<button 
              onClick={() => handleOAuthSignIn('twitter')}
              className="flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-900 transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <img src="/icons/twitter.svg" alt="X" className="w-5 h-5 mr-3" />
              Log in with X
            </button>*/}
            
            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="flex-shrink mx-4 text-gray-400" style={{ fontFamily: 'Quicksand, sans-serif' }}>or</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            
            {/* Email Button */}
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center justify-center w-full bg-[#F02B6C] hover:bg-pink-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              <img src="/icons/email.svg" alt="Email" className="w-5 h-5 mr-3" />
              Log in with Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#00CED1] bg-opacity-20 text-white border-none focus:ring-2 focus:ring-[#00CED1]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                placeholder="Your email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-white mb-2" style={{ fontFamily: 'Quicksand, sans-serif' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-[#00CED1] bg-opacity-20 text-white border-none focus:ring-2 focus:ring-[#00CED1]"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
                placeholder="Your password"
                required
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-500 text-white rounded-md" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-500 text-white rounded-md" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                {success}
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#F02B6C] hover:bg-pink-700 text-white font-medium rounded-md transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {isSubmitting ? 'Processing...' : 'Log in'}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;