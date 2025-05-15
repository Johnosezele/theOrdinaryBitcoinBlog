import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'signup';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => {
  // Set page title based on mode
  const pageTitle = mode === 'login' ? 'Login - The Ordinary Bitcoin Blog' : 'Sign Up - The Ordinary Bitcoin Blog';
  
  // Update document title
  React.useEffect(() => {
    document.title = pageTitle;
    return () => {
      document.title = 'The Ordinary Bitcoin Blog';
    };
  }, [pageTitle]);
  
  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden">
      
      
      {/* Main content */}
      <div className="flex-grow relative flex flex-col overflow-hidden">
        <div 
          className="overflow-hidden flex-grow relative flex flex-col" 
          style={{ backgroundImage: 'url(/images/cafe.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>
          
          {/* Content container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full overflow-y-auto py-10">
            <div className="container mx-auto px-4 max-w-md">
              <div className="mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;