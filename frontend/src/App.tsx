import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Story from './pages/Story';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='/story' element={ <Story/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
