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
import { loadCriticalImages, loadCommonAssets } from './utils/enhancedImagePreloader';
import QuizQuestion from './pages/quizPages/QuizQuestion';
import QuizResults from './pages/quizPages/QuizResults';

function App() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState<'critical' | 'common' | 'complete'>('critical');

  useEffect(() => {
    // Phase 1: Load critical images first (home page, first scene)
    loadCriticalImages((progress) => {
      // Update progress for critical images (0-70%)
      setLoadingProgress(progress * 0.7);
    })
      .then(() => {
        console.log('Critical images loaded successfully');
        setLoadingPhase('common');
        
        // Phase 2: Load common assets (frequently used characters, early visual aids)
        return loadCommonAssets();
      })
      .then(() => {
        console.log('Common assets loaded successfully');
        setLoadingPhase('complete');
        
        // Show the app with a small delay for smooth transition
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
      
    // Set up a timer to simulate progress for common assets (70-100%)
    // This runs in parallel with the actual loading
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Only update if we're in the common loading phase
        if (loadingPhase === 'common') {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return newProgress;
        }
        return prev;
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [loadingPhase]);

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
          <Route path='/quiz-question/' element={ <QuizQuestion/> } />
        <Route path='/quiz-results/' element={ <QuizResults/> } />
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
