import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Story from './pages/Story';
import QuizQuestion from './pages/QuizQuestion';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Home/> } />
        <Route path='/story' element={ <Story/> } />
        <Route path='/quiz-question/' element={ <QuizQuestion/> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
