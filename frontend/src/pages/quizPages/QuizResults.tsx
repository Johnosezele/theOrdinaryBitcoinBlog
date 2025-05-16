import { useNavigate, useLocation } from 'react-router-dom';

interface QuizResultsProps {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  storyId?: string;
}

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get actual quiz results from router state
  const resultData = location.state as QuizResultsProps || {
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    storyId: 'unknown'
  };
  
  const handleShareOnSocials = () => {
    // Implement social sharing logic here
    console.log('Share on socials clicked');
  };
  
  const handleNextStory = () => {
    // Navigate to the next story or section
    // If we have a specific story ID, we could use that for smarter navigation
    navigate('/story');
  };
  
  return (
    <div className="min-h-screen w-full bg-gray-300 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <h1 className="text-lg font-bold mb-16 self-start absolute top-8 left-8">
        The Ordinary Bitcoin Blog
      </h1>
      
      {/* Circular indicator */}
      <div className="relative mb-8">
        <div className="w-40 h-40 rounded-full border-8 border-gray-600 flex items-center justify-center bg-white">
          <span className="text-3xl font-bold">{resultData.score}%</span>
        </div>
      </div>
      
      {/* Success message */}
      <h2 className="text-2xl font-bold mb-6">You did it!</h2>
      
      {/* Description */}
      <p className="text-center text-gray-700 mb-16 max-w-md leading-relaxed">
        You answered {resultData.correctAnswers} out of {resultData.totalQuestions} questions correctly!
      </p>
      
      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleShareOnSocials}
          className="px-6 py-3 bg-white border border-gray-400 rounded text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Share on socials
        </button>
        <button
          onClick={handleNextStory}
          className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Next story
        </button>
      </div>
    </div>
  );
};

export default QuizResults;