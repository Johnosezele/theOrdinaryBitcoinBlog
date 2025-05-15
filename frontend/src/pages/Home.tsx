
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  // Debug user state
  console.log('Auth state in Home:', { user, loading });

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <nav className="bg-[#F8AB28] h-14 flex justify-between items-center px-3 sm:px-6 shadow-md z-20 flex-shrink-0">
        <div className="flex items-center">
          <span className="text-black font-bold text-lg" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            The Ordinary Bitcoin Blog
          </span>
        </div>
        <div>
          {user ? (
            <button 
              onClick={handleSignOut}
              className="p-2 bg-white hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Sign Out
            </button>
          ) : (
            <Link 
              to="/login"
              className="p-2 bg-white hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow relative flex flex-col overflow-hidden">
        <div 
          className="overflow-hidden flex-grow relative flex flex-col" 
          style={{ backgroundImage: 'url(/images/bob_carol.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full overflow-y-auto py-10 px-4">
            <h1 
              className="text-4xl font-bold text-white mb-8 text-center" 
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Learn Bitcoin through fun conversations <br /> with Carol and Bob
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
              {/* Story Card */}
              <div className="bg-[#F8AB28] rounded-lg overflow-hidden shadow-lg border border-[#F8AB28] border-opacity-80">
                <div className="p-6">
                  <h2 
                    className="text-2xl font-bold text-black mb-2" 
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Understanding Bitcoin Basics
                  </h2>
                  <p 
                    className="text-gray-800 mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Join Carol and Bob as they walk you through the fundamentals of Bitcoin.
                  </p>
                  <p 
                    className="text-gray-700 text-sm mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Duration: 5 min
                  </p>
                  <Link 
                    to="/story"
                    className="inline-block bg-[#F02B6C] hover:bg-pink-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Start Learning
                  </Link>
                </div>
              </div>

              {/* Coming Soon Card */}
              <div className="bg-[#F8AB28] rounded-lg overflow-hidden shadow-lg border border-[#F8AB28] border-opacity-80">
                <div className="p-6">
                  <h2 
                    className="text-2xl font-bold text-black mb-2" 
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Bitcoin Transactions
                  </h2>
                  <p 
                    className="text-gray-800 mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Learn how Bitcoin transactions work and how they're verified on the blockchain.
                  </p>
                  <p 
                    className="text-gray-700 text-sm mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Coming Soon
                  </p>
                  <button 
                    disabled
                    className="inline-block bg-gray-500 cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors opacity-70"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;