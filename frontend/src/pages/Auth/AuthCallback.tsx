import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Completing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        setMessage('Verifying your identity...');
        
        // Check for an error in the URL
        const errorParam = new URLSearchParams(window.location.search).get('error');
        const errorDescription = new URLSearchParams(window.location.search).get('error_description');
        
        if (errorParam) {
          throw new Error(errorDescription || errorParam);
        }

        // Get the URL hash (e.g., #access_token=...&token_type=bearer&...)
        const hashParams = window.location.hash;
        
        if (hashParams) {
          console.log('Processing OAuth callback...');
          setMessage('Processing login information...');
        }

        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Successful authentication
          setMessage('Login successful! Redirecting you to the home page...');
          
          // Short delay for better UX
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          // No session found
          setMessage('Session not found. Redirecting to login page...');
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } catch (err: any) {
        console.error('Authentication error:', err);
        setError(err.message || 'An error occurred during authentication');
        setMessage('There was a problem with authentication. Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {error ? (
          <div className="text-red-500">
            <h2 className="text-xl font-bold mb-4 font-quicksand">Authentication Error</h2>
            <p className="font-quicksand">{error}</p>
          </div>
        ) : (
          <div className="text-white">
            <h2 className="text-xl font-bold mb-4 font-quicksand">Authentication</h2>
            <p className="font-quicksand mb-4">{message}</p>
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
