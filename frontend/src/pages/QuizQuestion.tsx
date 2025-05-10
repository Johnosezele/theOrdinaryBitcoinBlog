import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Option {
  id: string;
  text: string;
}

const QuizQuestion = ({ totalQuestions = 4 }) => {
    
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const currentQuestionNumber = questionId ? parseInt(questionId) : 1;
  
  // Placeholder data - fetch from backend and use params going forward
  const question = {
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa?",
    options: [
      { id: "a", text: "Answer option" },
      { id: "b", text: "Answer option" },
      { id: "c", text: "Answer option" },
    ]
  };
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  // Navigation through quiz using params
  const goToPrevious = () => {
    if (currentQuestionNumber > 1) {
      navigate(`/quiz-question/${currentQuestionNumber - 1}`);
    }
  };
  
  const goToNext = () => {
    if (currentQuestionNumber < totalQuestions) {
      navigate(`/quiz-question/${currentQuestionNumber + 1}`);
    }
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-5 bg-gray-400">
      {/* Back button */}
      <div 
        className="absolute top-8 left-8 text-2xl font-bold cursor-pointer" 
        onClick={() => navigate('/')}
      >
        &lt;
    </div>
      
    {/* Character and speech bubble */}
    <div className="flex items-center mb-6 w-full max-w-xl">
        <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center text-sm text-center text-gray-800 shrink-0 mr-2">
            &lt;character head&gt;
        </div>
        <div className="bg-gray-200 rounded-3xl p-4 flex-1 shadow-md">
            {question.text}
        </div>
    </div>
      
      {/* Question card */}
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-md mb-8">
        <div className="text-right mb-4 text-sm font-medium">
          Question {currentQuestionNumber}/{totalQuestions}
        </div>
        
        {/* Answer options */}
        <div className="space-y-4">
          {question.options.map((option: Option) => (
            <div 
              key={option.id}
              className="flex items-center justify-between p-4 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50"
              onClick={() => handleOptionSelect(option.id)}
            >
              <span className="ml-2">{option.text}</span>
              <div className={`w-6 h-6 rounded-full border ${selectedOption === option.id ? 'border-gray-500' : 'border-gray-300'} flex items-center justify-center`}>
                {selectedOption === option.id && <div className="w-3 h-3 rounded-full bg-gray-500"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <div 
          className="w-10 h-10 flex items-center justify-center cursor-pointer" 
          onClick={goToPrevious}
        >
          &lt;
        </div>
        <div 
          className="w-10 h-10 flex items-center justify-center cursor-pointer" 
          onClick={goToNext}
        >
          &gt;
        </div>
      </div>
    </div>
  );
};

export default QuizQuestion;