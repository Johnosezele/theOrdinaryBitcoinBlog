import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Story from './pages/Story';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AuthCallback from './pages/Auth/AuthCallback';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LoadingScreen from './components/LoadingScreen';
import { preloadImages } from './utils/imagePreloader';

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Create individual image loading promises
    const imagePromises = preloadImages();
    
    // When all images are loaded
    imagePromises
      .then((results) => {
        // All images loaded successfully
        console.log(`Preloaded ${results.length} images successfully`);
        
        // Add a small delay to ensure smooth transition
        setTimeout(() => {
          setImagesLoaded(true);
        }, 500);
      })
      .catch(error => {
        console.error('Error preloading images:', error);
        // Show the app anyway after a timeout
        setTimeout(() => {
          setImagesLoaded(true);
        }, 3000);
      });
      
    // Set up a timer to simulate progress since we can't track individual image loads easily
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  }, []);

  if (!imagesLoaded) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/auth/callback' element={<AuthCallback/>} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/story' element={<Story/>} />
            {/* Add more protected routes here */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
