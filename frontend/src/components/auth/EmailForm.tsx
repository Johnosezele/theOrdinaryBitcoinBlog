import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EmailFormProps {
  mode: 'login' | 'signup';
}

const EmailForm: React.FC<EmailFormProps> = ({ mode }) => {
  const { signInWithEmail, signUpWithEmail, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setFormSubmitting(true);

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message || 'Failed to sign in');
        } else {
          setSuccessMessage('Signed in successfully');
          // Redirect to dashboard or home page after successful login
          setTimeout(() => {
            console.log('Navigating to home page...');
            window.location.href = '/';
          }, 1500);
        }
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message || 'Failed to sign up');
        } else {
          setSuccessMessage('Account created successfully');
          // Redirect to dashboard or home page after successful signup
          setTimeout(() => {
            console.log('Navigating to home page...');
            window.location.href = '/';
          }, 1500);
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="w-full px-4 py-3 bg-[#00CED1] bg-opacity-20 text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00CED1]"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          className="w-full px-4 py-3 bg-[#00CED1] bg-opacity-20 text-white placeholder-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00CED1]"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-100 text-sm">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-md text-green-100 text-sm">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || formSubmitting}
        className="w-full py-3 px-4 bg-[#F02B6C] hover:bg-pink-700 text-white font-bold rounded-md transition-colors disabled:opacity-70"
      >
        {formSubmitting ? 'Processing...' : mode === 'login' ? 'Log in' : 'Sign up'}
      </button>
    </form>
  );
};

export default EmailForm;
