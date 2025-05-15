import React from 'react';
import { Link } from 'react-router-dom';

interface AuthHeaderProps {
  mode: 'login' | 'signup';
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ mode }) => {
  return (
    <div className="text-center mb-8">
      {mode === 'login' ? (
        <>
          <h1 className="text-3xl font-bold text-white mb-4 font-quicksand">Welcome back</h1>
          <p className="text-gray-300 font-quicksand">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#F02B6C] hover:underline">
              Sign up for free here.
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-white mb-2 font-quicksand">Learn Bitcoin through</h1>
          <h1 className="text-3xl font-bold text-white mb-4 font-quicksand">fun and visually engaging conversations with Carol and Bob</h1>
          <p className="text-gray-300 font-quicksand">
            Already a user?{' '}
            <Link to="/login" className="text-[#F02B6C] hover:underline">
              Log in here.
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthHeader;
