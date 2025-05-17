import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

interface QuizResultsProps {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  storyId?: string;
}

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { width, height } = useWindowSize();
  
  // State for confetti animation
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Get actual quiz results from router state
  const resultData = location.state as QuizResultsProps || {
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    storyId: 'unknown'
  };
  
  // Show confetti for perfect scores
  useEffect(() => {
    const score = resultData.score || 0;
    if (score === 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [resultData.score]);
  
  const handleShareOnSocials = () => {
    // Implement social sharing logic here
    console.log('Share on socials clicked');
  };
  
  const handleNextStory = () => {
    // Navigate to the next story or section
    // If we have a specific story ID, we could use that for smarter navigation
    navigate('/story');
  };
  
  // Function to get appropriate message based on score percentage
  const getResultMessage = () => {
    const score = resultData.score || 0; // Handle possible undefined
    if (score >= 90) return "Excellent! You're a Bitcoin Expert!";
    if (score >= 75) return "Great Job! Keep Learning!";
    if (score >= 50) return "Good Effort! Review and Try Again!";
    if (score >= 25) return "Nice Start! More Practice Needed.";
    return "Don't Give Up! Let's Try Again!";
  };

  // Handler for retrying the quiz
  const handleRetryQuiz = () => {
    navigate(`/quiz-question/1`);
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background with dark overlay - same as quiz questions */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: `url('/images/cafe.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-8">
        {/* Header */}
        <h1 className="text-lg font-bold mb-16 self-start absolute top-8 left-8 text-white">
          The Ordinary Bitcoin Blog
        </h1>
        
        {/* Animated confetti for perfect score */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      {/* Circular indicator with progress */}
      <div className="relative mb-8">
        {/* Base circle with progress overlay */}
        <div className="relative">
          {/* SVG container for circle */}
          <svg className="w-40 h-40" viewBox="0 0 100 100">
            {/* Conditional rendering based on score */}
            {(resultData.score || 0) === 100 ? (
              /* For 100% score - show solid gold circle */
              <>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="white"
                  stroke="#FFD700"
                  strokeWidth="8"
                />
              </>
            ) : (
              /* For other scores - show partial progress */
              <>
                {/* Base gray circle */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="white"
                  stroke="#4B5563" /* gray-600 */
                  strokeWidth="8"
                />
                
                {/* Gold progress indicator */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  fill="transparent"
                  stroke="#FFD700" 
                  strokeWidth="8"
                  strokeDasharray={`${(resultData.score || 0) * 2.89} 1000`}
                  strokeDashoffset="0"
                  style={{
                    transformOrigin: 'center',
                    transform: 'rotate(-90deg)',
                    transition: 'stroke-dasharray 1.5s ease-out'
                  }}
                />
              </>
            )}
          </svg>
          
          {/* Score text */}
          <div 
            className={`absolute inset-0 flex items-center justify-center
              ${(resultData.score || 0) === 100 ? 'shadow-[0_0_15px_5px_rgba(72,187,120,0.7)] rounded-full' : ''}`}
          >
            <span className="text-3xl font-bold z-10 text-gray-800">{resultData.score}%</span>
          </div>
        </div>
      </div>
        
        {/* Dynamic success message based on score */}
        <h2 className="text-2xl font-bold mb-6 text-white">{getResultMessage()}</h2>
        
        {/* Description */}
        <p className="text-center text-gray-100 mb-16 max-w-md leading-relaxed">
          You answered {resultData.correctAnswers} out of {resultData.totalQuestions} questions correctly!
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* Share button (blurred out) */}
          <button
            onClick={handleShareOnSocials}
            className="px-6 py-3 bg-white border border-gray-400 rounded text-gray-700 opacity-40 cursor-not-allowed"
            disabled
          >
            Share on socials
          </button>

          {/* Retry quiz button with similar styling to other gold buttons */}
          <button
            onClick={handleRetryQuiz}
            className="px-6 py-3 bg-[#FFD700] hover:bg-amber-400 text-gray-800 font-bold rounded-xl shadow-xl transition-colors duration-150"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Retry Quiz
          </button>
          
          {/* Next story button */}
          <button
            onClick={handleNextStory}
            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-xl"
          >
            Next story
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;