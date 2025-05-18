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
    <div className="relative min-h-screen w-full overflow-x-hidden">
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
      
      {/* Content container with improved mobile responsiveness */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-6 md:p-8 overflow-y-auto">
        {/* Header with responsive positioning */}
        <h1 className="text-base sm:text-lg font-bold mb-12 sm:mb-16 self-start absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 text-white">
          The Ordinary Bitcoin Blog
        </h1>
        
        {/* Animated confetti for perfect score */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={width < 768 ? 200 : 500} />}
      
      {/* Circular indicator with progress - responsively sized */}
      <div className="relative mb-6 sm:mb-8 mt-10 sm:mt-0">
        {/* Base circle with progress overlay */}
        <div className="relative">
          {/* SVG container for circle - responsive sizing */}
          <svg className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40" viewBox="0 0 100 100">
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
          
          {/* Score text - responsive font size */}
          <div 
            className={`absolute inset-0 flex items-center justify-center
              ${(resultData.score || 0) === 100 ? 'shadow-[0_0_15px_5px_rgba(72,187,120,0.7)] rounded-full' : ''}`}
          >
            <span className="text-xl sm:text-2xl md:text-3xl font-bold z-10 text-gray-800">{resultData.score}%</span>
          </div>
        </div>
      </div>
        
        {/* Dynamic success message based on score - responsive text */}
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white text-center px-2">{getResultMessage()}</h2>
        
        {/* Description - better spacing on mobile */}
        <p className="text-center text-gray-100 mb-8 sm:mb-12 md:mb-16 max-w-md leading-relaxed text-sm sm:text-base px-2">
          You answered {resultData.correctAnswers} out of {resultData.totalQuestions} questions correctly!
        </p>
        
        {/* Action buttons - better mobile layout */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full max-w-md px-4 sm:px-0">
          {/* Share button (blurred out) */}
          <button
            onClick={handleShareOnSocials}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-white border border-gray-400 rounded text-gray-700 opacity-40 cursor-not-allowed text-sm sm:text-base"
            disabled
          >
            Share on socials
          </button>

          {/* Retry quiz button with similar styling to other gold buttons */}
          <button
            onClick={handleRetryQuiz}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#FFD700] hover:bg-amber-400 text-gray-800 font-bold rounded-xl shadow-xl transition-colors duration-150 text-sm sm:text-base order-first sm:order-none mb-2 sm:mb-0"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Retry Quiz
          </button>
          
          {/* Next story button */}
          <button
            onClick={handleNextStory}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-xl text-sm sm:text-base"
          >
            Next story
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;