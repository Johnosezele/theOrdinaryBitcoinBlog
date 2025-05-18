
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
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Header - Made mobile friendly with better overflow handling */}
      <nav className="bg-[#F8AB28] py-3 flex justify-between items-center px-3 sm:px-6 shadow-md z-20 flex-shrink-0">
        <div className="flex items-center">
          <span className="text-black font-bold text-sm sm:text-base md:text-lg truncate max-w-[200px] sm:max-w-none" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            The Ordinary Bitcoin Blog
          </span>
        </div>
        <div>
          {user ? (
            <button 
              onClick={handleSignOut}
              className="p-2 bg-white hover:bg-gray-100 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Sign Out
            </button>
          ) : (
            <Link 
              to="/login"
              className="p-2 bg-white hover:bg-gray-100 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Main content - Improved scrolling behavior */}
      <div className="flex-grow relative flex flex-col overflow-auto">
        <div 
          className="min-h-full relative flex flex-col overflow-auto" 
          style={{ backgroundImage: 'url(/images/bob_carol.svg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          
          {/* Content - Improved padding for mobile and better overflow handling */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-full overflow-y-auto py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6">
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center break-words" 
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
            >
              Learn Bitcoin through fun conversations
              <span className="hidden xs:inline"> <br /></span>
              <span className="xs:hidden"> </span>
              with Carol and Bob
            </h1>

            {/* Improved grid with better spacing for mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full mx-auto px-2 sm:px-0 sm:max-w-4xl">
              {/* Story Card - Better mobile spacing and text wrapping */}
              <div className="bg-[#F8AB28] rounded-lg overflow-hidden shadow-lg border border-[#F8AB28] border-opacity-80">
                <div className="p-4 sm:p-5 md:p-6">
                  <h2 
                    className="text-xl sm:text-2xl font-bold text-black mb-2 break-words" 
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Understanding Bitcoin Basics
                  </h2>
                  <p 
                    className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base break-words" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Join Carol and Bob as they walk you through the fundamentals of Bitcoin.
                  </p>
                  <p 
                    className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Duration: 5 min
                  </p>
                  <Link 
                    to="/story"
                    className="inline-block bg-[#F02B6C] hover:bg-pink-700 text-white py-2 px-4 rounded-md text-sm sm:text-base font-medium transition-colors"
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Start Learning
                  </Link>
                </div>
              </div>

              {/* Coming Soon Card - Better mobile spacing and text wrapping */}
              <div className="bg-[#F8AB28] rounded-lg overflow-hidden shadow-lg border border-[#F8AB28] border-opacity-80">
                <div className="p-4 sm:p-5 md:p-6">
                  <h2 
                    className="text-xl sm:text-2xl font-bold text-black mb-2 break-words" 
                    style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 600 }}
                  >
                    Bitcoin Transactions
                  </h2>
                  <p 
                    className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base break-words" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Learn how Bitcoin transactions work and how they're verified on the blockchain.
                  </p>
                  <p 
                    className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4" 
                    style={{ fontFamily: 'Quicksand, sans-serif' }}
                  >
                    Coming Soon
                  </p>
                  <button 
                    disabled
                    className="inline-block bg-gray-500 cursor-not-allowed text-white py-2 px-4 rounded-md text-sm sm:text-base font-medium transition-colors opacity-70"
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