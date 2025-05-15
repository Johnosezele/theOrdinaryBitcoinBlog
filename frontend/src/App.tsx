import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Story from './pages/Story';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AuthCallback from './pages/Auth/AuthCallback';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
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
