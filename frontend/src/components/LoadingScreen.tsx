import React from 'react';

interface LoadingScreenProps {
  progress?: number; // Optional progress percentage (0-100)
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <h1 
          className="text-3xl font-bold text-white mb-6" 
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          The Ordinary Bitcoin Blog
        </h1>
        
        <div className="w-64 h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-[#F8AB28] transition-all duration-300 ease-out"
            style={{ width: `${progress ?? 0}%` }}
          ></div>
        </div>
        
        <p 
          className="text-white text-sm"
          style={{ fontFamily: 'Quicksand, sans-serif' }}
        >
          {progress ? `Loading... ${Math.round(progress)}%` : 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
