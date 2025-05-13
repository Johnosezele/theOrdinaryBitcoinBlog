import { useNavigate } from 'react-router-dom';

interface QuizResultsProps {
  score?: number;
  totalQuestions?: number;
  correctAnswers?: number;
}

const QuizResults: React.FC<QuizResultsProps> = ({ 
  score = 100, 
//   totalQuestions = 4, 
//   correctAnswers = 4 
}) => {
  const navigate = useNavigate();
  
  const handleShareOnSocials = () => {
    // Implement social sharing logic here
    console.log('Share on socials clicked');
  };
  
  const handleNextStory = () => {
    // Navigate to the next story or section
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
          <span className="text-3xl font-bold">{score}%</span>
        </div>
      </div>
      
      {/* Success message */}
      <h2 className="text-2xl font-bold mb-6">You did it!</h2>
      
      {/* Description */}
      <p className="text-center text-gray-700 mb-16 max-w-md leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor.
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