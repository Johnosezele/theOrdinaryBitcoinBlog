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
    const [correctAnswers, setCorrectAnswers] = useState(0);
      
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
    
    // // Placeholder data 
    // const placeholderQuestions: Question[] = [
    //   {
    //     id: "1",
    //     text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa?",
    //     options: [
    //       { id: "a", text: "Answer option" },
    //       { id: "b", text: "Answer option" },
    //       { id: "c", text: "Answer option" }
    //     ],
    //     correct_answer: "Answer option"
    //   },
    // ];

    // Fetch quiz from backend
    useEffect(() => {
      const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch('http://localhost:5000/quiz/questions');
          if (!response.ok) throw new Error('Failed to fetch questions');
          
          const data = await response.json();
          const transformedQuestions = transformBackendData(data.questions);
          setQuestions(transformedQuestions);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch questions');
          console.error('Error fetching questions:', err);
        } finally {
          setLoading(false);
        }
        
        // // Temporary: Use placeholder data
        // setQuestions(placeholderQuestions);
      };
      
      fetchQuestions();
    }, [storyId]);
    
    // Get current question
    const currentQuestion = questions[currentQuestionNumber - 1];
    
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
      // Check if current answer is correct before moving
      if (currentQuestion && selectedOption) {
        const selectedOptionText = currentQuestion.options.find(opt => opt.id === selectedOption)?.text;
        if (selectedOptionText === currentQuestion.correct_answer) {
          setCorrectAnswers(prev => prev + 1);
        }
      }
      
      if (currentQuestionNumber < (questions.length || totalQuestions)) {
        navigate(`/quiz-question/${currentQuestionNumber + 1}`);
      } else {
        // Calculate final score and navigate to results
        const finalCorrect = correctAnswers + (selectedOption && currentQuestion ? 1 : 0);
        const percentage = Math.round((finalCorrect / (questions.length || totalQuestions)) * 100);
        
        navigate(`/story/${storyId}/quiz-results`, { 
          state: { 
            score: percentage,
            correctAnswers: finalCorrect,
            totalQuestions: questions.length || totalQuestions,
            userAnswers: userAnswers
          } 
        });
      }
      
      // Reset selection for next question
      setSelectedOption(null);
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
            {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>
      
      {/* Question card */}
      <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-md mb-8">
        <div className="text-right mb-4 text-sm font-medium">
          Question {currentQuestionNumber}/{questions.length || totalQuestions}
        </div>
        
        {/* Answer options */}
        <div className="space-y-4">
          {currentQuestion?.options?.map((option: Option) => (
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