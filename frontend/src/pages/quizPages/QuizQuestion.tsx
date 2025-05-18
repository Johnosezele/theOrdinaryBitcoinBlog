import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface BackendQuestion {
  story_id: string;
  question_text: string;
  correct_option: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[]; 
  correct_answer: string;
}

interface Option {
  id: string;
  text: string;
}

interface QuizQuestionProps {
  totalQuestions?: number;
  storyId?: string; 
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
    totalQuestions = 4, 
    storyId = "sample-story-id" // Default for now, will come from route params or props
  }) => {
        
    const { questionId } = useParams<{ questionId: string }>();
    const navigate = useNavigate();
    const currentQuestionNumber = questionId ? parseInt(questionId) : 1;
    
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false); // Set to true when backend quizzes are ready
    const [error, setError] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const [userAnswers, setUserAnswers] = useState<{[questionIndex: number]: string}>({})
      
    // Function to convert backend data to frontend format
    const transformBackendData = (backendQuestions: BackendQuestion[]): Question[] => {
      return backendQuestions.map((q, index) => ({
        id: (index + 1).toString(),
        text: q.question_text,
        options: [
          { id: "a", text: q.option_a },
          { id: "b", text: q.option_b },
          { id: "c", text: q.option_c },
          { id: "d", text: q.option_d }
        ],
        correct_answer: q.correct_option
      }));
    };
    
    // Fetch quiz from backend
    // API base URL for all backend requests
    // Using Vite's environment variable format
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://theordinarybitcoinblog.onrender.com';

    useEffect(() => {
      const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        
        try {
          // Use API_BASE_URL instead of hardcoded localhost
          const response = await fetch(`${API_BASE_URL}/quiz/questions`);
          
          if (!response.ok) throw new Error('Failed to fetch questions');
          
          const data = await response.json();
          const transformedQuestions = transformBackendData(data.questions);
          setQuestions(transformedQuestions);
        } catch (err) {
          console.error('Error fetching questions:', err);
          setLoading(false);
          setError('Failed to load questions. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchQuestions();
    }, [storyId]);
    
    // Get current question
    const currentQuestion = questions[currentQuestionNumber - 1];
    
    // Set the selected option from saved answers when navigating between questions
    useEffect(() => {
      const savedAnswer = userAnswers[currentQuestionNumber - 1];
      if (savedAnswer) {
        setSelectedOption(savedAnswer);
      } else {
        setSelectedOption(null); // Clear selection for new questions
      }
    }, [currentQuestionNumber, userAnswers]);
    
    const handleOptionSelect = (optionId: string) => {
      setSelectedOption(optionId);

      // Save user's answer
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionNumber - 1]: optionId
      }));
    };
    
    // Navigation through quiz using params
    const goToPrevious = () => {
      if (currentQuestionNumber > 1) {
        navigate(`/quiz-question/${currentQuestionNumber - 1}`);
      }
    };
    
    const goToNext = () => {
      // We'll calculate all correct answers when navigating to results
      // No need to track individual correctness here
      
      if (currentQuestionNumber < (questions.length || totalQuestions)) {
        navigate(`/quiz-question/${currentQuestionNumber + 1}`);
      } else {
        // Calculate final score by counting all correct answers from userAnswers
        let totalCorrect = 0;
        
        // Check each answer against the correct answer for each question
        for (let i = 0; i < questions.length; i++) {
          const userAnswer = userAnswers[i];
          if (userAnswer) {
            const question = questions[i];
            const selectedOptionText = question.options.find(opt => opt.id === userAnswer)?.text;
            if (selectedOptionText === question.correct_answer) {
              totalCorrect++;
            }
          }
        }
        
        const percentage = Math.round((totalCorrect / (questions.length || totalQuestions)) * 100);
        
        navigate(`/quiz-results`, { 
          state: { 
            score: percentage,
            correctAnswers: totalCorrect,
            totalQuestions: questions.length || totalQuestions,
            userAnswers: userAnswers,
            storyId: storyId // Keep the storyId in state if needed later
          } 
        });
      }
    };


    // Loading and error states
    if (loading) {
      return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-5 bg-gray-400">
          <div className="text-xl">Loading questions...</div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-5 bg-gray-400">
          <div className="text-xl text-red-600">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }
    
    if (!currentQuestion) {
      return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-5 bg-gray-400">
          <div className="text-xl">Question not found</div>
        </div>
      );
    }
    
    return (
      <div className="relative min-h-screen w-full">
        {/* Background with dark overlay */}
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `url('/images/cafe.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        {/* Content container with improved mobile/tablet responsiveness */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-5 md:p-6 overflow-y-auto">
          {/* Back button with adjusted position for mobile */}
          <div 
            className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 cursor-pointer" 
            onClick={() => navigate(`/story/${storyId}`)}
          >
            <img src="/icons/arrow-left.svg" alt="Back" width="24" height="24" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          </div>
          
          {/* Character and speech bubble with improved mobile layout */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6 w-full max-w-xl px-2 sm:px-0 mt-12 sm:mt-16 md:mt-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 mr-0 sm:mr-2 mb-3 sm:mb-0">
                <img src="/images/characters/carol_asking.png" alt="Carol" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-200 rounded-3xl p-3 sm:p-4 flex-1 shadow-md">
                <span className="text-sm sm:text-base md:text-lg font-medium break-words">{currentQuestion ? currentQuestion.text : "Loading question..."}</span>
            </div>
          </div>
          
          {/* Question card with better spacing for mobile */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 md:p-6 w-full max-w-lg shadow-md mb-6 sm:mb-8">
            <div className="text-right mb-3 sm:mb-4 text-xs sm:text-sm font-medium">
              Question {currentQuestionNumber}/{questions.length || totalQuestions}
            </div>
            
            {/* Answer options with better text handling */}
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion?.options?.map((option: Option) => (
                <div 
                  key={option.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <span className="ml-1 sm:ml-2 text-sm sm:text-base break-words pr-2 flex-1">{option.text}</span>
                  <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border ${selectedOption === option.id ? 'border-gray-500' : 'border-gray-300'} flex-shrink-0 flex items-center justify-center`}>
                    {selectedOption === option.id && <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-500"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows with better positioning for mobile */}
          <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 flex space-x-4 sm:space-x-6 z-20">
            {/* Hide left arrow on first question */}
            {currentQuestionNumber > 1 && (
              <div 
                className="w-10 h-10 flex items-center justify-center cursor-pointer" 
                onClick={goToPrevious}
              >
                <img src="/icons/arrow-left.svg" alt="Previous" className="w-8 h-8 sm:w-8 sm:h-8" />
              </div>
            )}
            
            {/* Show right arrow on middle questions */}
            {currentQuestionNumber < (questions.length || totalQuestions) && (
              <div 
                className="w-10 h-10 flex items-center justify-center cursor-pointer" 
                onClick={goToNext}
              >
                <img src="/icons/arrow-right.svg" alt="Next" className="w-8 h-8 sm:w-8 sm:h-8" />
              </div>
            )}
          </div>
          
          {/* Submit button on last question - responsive positioning */}
          {currentQuestionNumber === (questions.length || totalQuestions) && (
            <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
              <button
                onClick={goToNext} 
                className="bg-[#FFD700] hover:bg-amber-400 text-gray-800 font-bold rounded-xl shadow-xl
                          py-2 px-4 sm:py-3 sm:px-6 md:py-4 md:px-8 
                          text-sm sm:text-base md:text-lg 
                          transition-colors duration-150"
                style={{ fontFamily: 'Quicksand, sans-serif' }}
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    );
};

export default QuizQuestion;
