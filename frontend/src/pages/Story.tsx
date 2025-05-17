import { useState, useEffect, useMemo } from 'react';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { useNavigate } from 'react-router-dom';
import { preloadUpcomingScenes, Scene as StoryScene } from '../utils/enhancedImagePreloader';
import rawDialogueData from '../data/story1.json';

interface Character {
  image: string;
  emotion: string;
  dialogueActive: boolean;
  dialogue: string;
  size?: 'small' | 'large';
}

interface CentralDialogue {
  active: boolean;
  content: string;
}

interface Scene {
  id: string;
  storyNumber: number;
  sceneNumber: string;
  type: 'intro' | 'dialogue';
  background: string;
  title?: string;
  subtitle?: string;
  ctaButton?: string;
  leftCharacter?: Character;
  rightCharacter?: Character;
  centralDialogue?: CentralDialogue;
  visualAid?: string | null;
  duration?: string;
}

interface DialogueData {
  scenes: Scene[];
}

// Raw data interface from JSON file
interface RawScene {
  id: string;
  storyNumber: number;
  sceneNumber: string;
  type: string;
  background: string;
  title?: string;
  subtitle?: string;
  ctaButton?: string;
  leftCharacter?: {
    image: string;
    emotion: string;
    dialogueActive: boolean;
    dialogue: string;
    size?: 'small' | 'large';
  };
  rightCharacter?: {
    image: string;
    emotion: string;
    dialogueActive: boolean;
    dialogue: string;
    size?: 'small' | 'large';
  };
  centralDialogue?: {
    active: boolean;
    content: string;
  };
  visualAid?: string | null;
  duration?: string;
}

interface RawDialogueData {
  scenes: RawScene[];
}

// Type guard function to validate scene type
function isValidSceneType(type: string): type is 'intro' | 'dialogue' {
  return type === 'intro' || type === 'dialogue';
}

// Process the raw data to ensure it has the right types
const processDialogueData = (data: RawDialogueData): DialogueData => {
  const processedScenes = data.scenes.map((scene: RawScene): Scene => {
    if (!isValidSceneType(scene.type)) {
      throw new Error(`Invalid scene type: ${scene.type}`);
    }
    return {
      ...scene,
      type: scene.type
    };
  });

  return {
    scenes: processedScenes
  };
};

const dialogueData = processDialogueData(rawDialogueData as RawDialogueData);

const visualAidMap: { 
  [key: string]: { 
    src: string | null; 
    alt: string; 
    displaySize?: 'small' | 'medium' | 'large';
  } 
} = {
  "blockchain-diagram": { src: "/images/visual-aids/blockchain-diagram.png", alt: "Blockchain diagram illustration", displaySize: 'medium' },
  "bitcoin-key": { src: "/images/visual-aids/bitcoin_key.png", alt: "Bitcoin key illustration", displaySize: 'medium' },
  "blockchain-illustration": { src: "/images/visual-aids/blochain_illustration.png", alt: "Illustration explaining blockchain", displaySize: 'large' },
  "bitcoin-padlock": { src: "/images/visual-aids/bitcoin_padlock.png", alt: "Illustration of Bitcoin security with a padlock", displaySize: 'large' },
  "bitcoin-mining": { src: "/images/visual-aids/bitcoin_mining.png", alt: "Illustration of Bitcoin mining", displaySize: 'large' },
  "bitcoin-reward": { src: "/images/visual-aids/bitcoin_reward.png", alt: "Illustration of Bitcoin reward", displaySize: 'large' },
  "bitcoin-machine": { src: "/images/visual-aids/bitcoin_machine.png", alt: "Illustration of Bitcoin machine", displaySize: 'large' },
  "bitcoin-block": { src: "/images/visual-aids/bitcoin_block.png", alt: "Illustration of Bitcoin block", displaySize: 'large' },
  "bitcoin-wallet": { src: "/images/visual-aids/bitcoin_wallet.png", alt: "Bitcoin wallet illustration", displaySize: 'large' },
  "bitcoin-exchange": { src: "/images/visual-aids/bitcoin_exchange.png", alt: "Bitcoin exchange illustration", displaySize: 'large' },
  "hardware-wallet": { src: "/images/visual-aids/hardware_wallets.png", alt: "Hardware wallet illustration", displaySize: 'large' },
  "written-seedphrase": { src: "/images/visual-aids/written_seedphrase.png", alt: "Written seedphrase illustration", displaySize: 'large' },
  "mobile-seedphrase": { src: "/images/visual-aids/mobile_seedphrase.png", alt: "Mobile seedphrase illustration", displaySize: 'large' },
  "bitcoin-address": { src: "/images/visual-aids/bitcoin_address.png", alt: "Bitcoin address illustration", displaySize: 'medium' },
  "bitcoin-pending": { src: "/images/visual-aids/bitcoin_pending.png", alt: "Bitcoin pending illustration", displaySize: 'medium' },
  "bitcoin-confirmed": { src: "/images/visual-aids/bitcoin_confirmed.png", alt: "Bitcoin confirmed illustration", displaySize: 'medium' },
};

const Story: React.FC = () => {
  const navigate = useNavigate();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene = dialogueData.scenes[currentSceneIndex];
  const { width, height } = useWindowSize();
  const [confettiActive, setConfettiActive] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [progressPulse, setProgressPulse] = useState(false);
  const [progressFading, setProgressFading] = useState(false);
  // Calculate dialogue scene indices once using useMemo instead of state + useEffect
  const { firstDialogueSceneIndex, lastDialogueSceneIndex } = useMemo(() => {
    const first = dialogueData.scenes.findIndex(scene => scene.type === 'dialogue');
    const last = [...dialogueData.scenes].reverse()
               .findIndex(scene => scene.type === 'dialogue');
    return {
      firstDialogueSceneIndex: first,
      lastDialogueSceneIndex: last === -1 ? -1 : dialogueData.scenes.length - 1 - last,
    };
  }, [dialogueData.scenes]);

  useEffect(() => {
    if (currentScene.type === 'dialogue') {
      // Preload upcoming scenes when current scene changes
      preloadUpcomingScenes(dialogueData.scenes as StoryScene[], currentSceneIndex, 3);
    }
  }, [currentScene, currentSceneIndex, dialogueData.scenes]);

  useEffect(() => {
    if (dialogueData.scenes.length > 0 && lastDialogueSceneIndex !== -1 && currentSceneIndex === lastDialogueSceneIndex && currentScene.type === 'dialogue') {
      setProgressFading(true);
      const confettiTimer = setTimeout(() => setConfettiActive(true), 500);
      const modalTimer = setTimeout(() => {
        setConfettiActive(false);
        setShowQuizModal(true);
      }, 5000);
      return () => {
        clearTimeout(confettiTimer);
        clearTimeout(modalTimer);
      };
    } else {
      setConfettiActive(false);
      setShowQuizModal(false);
      setProgressFading(false);
    }
  }, [currentSceneIndex, lastDialogueSceneIndex, currentScene.type, dialogueData.scenes.length]);
  
  useEffect(() => {
    if (currentScene.type === 'dialogue' && (lastDialogueSceneIndex === -1 || currentSceneIndex !== lastDialogueSceneIndex) ) {
      setProgressPulse(true);
      const pulseTimer = setTimeout(() => setProgressPulse(false), 1000);
      return () => clearTimeout(pulseTimer);
    }
  }, [currentSceneIndex, currentScene.type, lastDialogueSceneIndex]);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @keyframes progressPulse {
        0% { box-shadow: 0 0 5px 0 rgba(240, 173, 78, 0.5); }
        50% { box-shadow: 0 0 15px 5px rgba(240, 173, 78, 0.8); }
        100% { box-shadow: 0 0 5px 0 rgba(240, 173, 78, 0.5); }
      }
      .pulse-animation {
        animation: progressPulse 1s ease-in-out;
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  const goToNextScene = () => {
    if (currentSceneIndex < dialogueData.scenes.length - 1) {
      setProgressPulse(false);
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const goToPrevScene = () => {
    if (currentSceneIndex > 0) {
      setProgressPulse(false);
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const renderVisualAid = (type: string | null | undefined) => {
    if (!type || !visualAidMap[type]) return null;

    const aidData = visualAidMap[type];
    const size = aidData.displaySize || 'medium'; 

    let sizeClass = '';
    // NEW, MUCH LARGER SIZES FOR VISUAL AIDS
    switch (size) {
      case 'small': 
        // Small visual aids should still be relatively modest
        sizeClass = 'w-32 sm:w-36 md:w-40 lg:w-48'; // Approx 128px to 192px
        break;
      case 'large': 
        // This is for very prominent visual aids like the padlock
        sizeClass = 'w-48 sm:w-64 md:w-80 lg:w-96 xl:w-[448px]'; // Approx 192px up to 448px (28rem)
        break;
      case 'medium': 
      default: 
        sizeClass = 'w-40 sm:w-48 md:w-56 lg:w-64 xl:w-80'; // Approx 160px up to 320px
        break;
    }
    
    const visualAidBaseContainerClasses = "p-1 sm:p-2 md:p-3 rounded-lg mx-auto";
    const visualAidImageClasses = "w-full h-auto object-contain shadow-lg rounded-lg";

    return (
      <div className={`${visualAidBaseContainerClasses} ${sizeClass}`}>
        {aidData.src ? (
          <img
            src={aidData.src}
            alt={aidData.alt}
            className={visualAidImageClasses}
          />
        ) : (
          <p className="text-center text-gray-500 italic h-32 sm:h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg text-xs sm:text-sm">{aidData.alt}</p>
        )}
      </div>
    );
  };

  const renderCharacterWithBubble = (
    character: Character | undefined,
    position: 'left' | 'right'
  ) => {
    if (!character) return null;

    const imageSrc = `/images/characters/${character.image}`;
    const currentSize = character.size || 'small'; 

    let avatarSizeClass = '';
    let bubbleMaxWidthClass = '';
    let textSizeClass = '';

    if (currentSize === 'large') {
      // SIGNIFICANTLY LARGER AVATAR SIZES
      avatarSizeClass = "w-32 h-32 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-56 lg:h-56"; // Approx 128px to 224px
      // WIDER BUBBLE
      bubbleMaxWidthClass = "md:max-w-sm lg:max-w-md xl:max-w-lg"; // Approx 24rem to 32rem
      // LARGER TEXT
      textSizeClass = "text-base sm:text-lg md:text-xl"; 
    } else { // 'small' (listening character)
      avatarSizeClass = "w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-32 lg:h-32"; 
      bubbleMaxWidthClass = "md:max-w-[150px] lg:max-w-[180px]";
      textSizeClass = "text-xs sm:text-sm";
    }
      
    const containerClass = `flex flex-col items-center w-full ${
        position === 'left' ? 'md:items-start' : 'md:items-end'
      } md:w-1/2`; 
    
    const bubbleBaseClass = `bg-[#FFF8F1] border-2 border-[#F8AB28] rounded-xl shadow font-quicksand text-[#070C02]
      px-3 py-2 sm:px-4 sm:py-3 mt-2 
      w-[90%] sm:w-[80%] md:w-auto max-w-full 
      ${position === 'left' ? 'text-left' : 'text-left'} md:text-left`;

    const dialogueContent = character.dialogueActive && character.dialogue ? character.dialogue : '...';
      
    return (
      <div className={`${containerClass} my-2 md:my-3`}>
        <div className={`flex ${position === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-3 sm:gap-4 w-full md:w-auto`}> 
            <div className={`${avatarSizeClass} rounded-full overflow-hidden shadow-md flex-shrink-0`}>
              <img src={imageSrc} alt={character.emotion || 'character'} className="w-full h-full object-cover" />
            </div>
            
            {character.dialogueActive && character.dialogue && (
              <div className={`${bubbleBaseClass} ${bubbleMaxWidthClass} ${textSizeClass}`}>
                {dialogueContent.split('\n').map((line, index) => (
                  <span key={index} className="block">{line}</span>
                ))}
              </div>
            )}
        </div>
      </div>
    );
  };
  
  const renderCharacter = (character: Character | undefined, position: string, characterType: 'left' | 'right') => {
    if (!character) return null;
    const imageSrc = `/images/characters/${character.image}`;
    return (
      <div className={`flex flex-col items-center ${position} p-1 sm:p-2`}>
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 sm:border-4 border-[#F8AB28] bg-white shadow-md">
          <img src={imageSrc} alt={`Character ${characterType}`} className="w-full h-full object-cover" />
        </div>
        {character.dialogueActive && character.dialogue && (
          <div className="mt-2 p-1 sm:p-2 bg-white rounded-lg border border-gray-300 shadow-lg max-w-[150px] sm:max-w-xs">
            <p className="text-xs sm:text-sm font-quicksand">{character.dialogue}</p>
          </div>
        )}
      </div>
    );
  };

  const renderIntroScene = (scene: Scene) => {
    return (
      <div className="relative flex-1">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage:`url(/images/${scene.background}.png)` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-6 md:p-8 lg:p-12 text-white">
          <div className="mb-10 sm:mb-12 md:mb-16 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"> 
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-left"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }} 
            >
              {scene.title}
            </h1>
            <p
              className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 text-left"
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              {scene.subtitle}
            </p>
            <p
              className="text-xs sm:text-sm opacity-90 text-left" 
              style={{ fontFamily: 'Quicksand, sans-serif' }}
            >
              Duration: {scene.duration || '5 min'}
            </p>
          </div>

          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-12 lg:right-12">
            <button
              onClick={goToNextScene}
              className="bg-[#F02B6C] hover:bg-pink-700 text-white rounded-md 
                         py-2 px-4 sm:py-2 sm:px-5 md:py-3 md:px-6 
                         text-sm sm:text-base transition-colors"
              style={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 700 }} 
            >
              {scene.ctaButton}
            </button>
          </div>
        </div>
      </div>
    );
  };
  


  const renderDialogueScene = (scene: Scene) => {
    const useFigmaStyleLayout = 
      scene.leftCharacter && 
      scene.rightCharacter && 
      (scene.leftCharacter.dialogueActive || scene.rightCharacter.dialogueActive) &&
      !scene.centralDialogue?.active;

    if (useFigmaStyleLayout) {
      const leftChar = scene.leftCharacter!;
      const rightChar = scene.rightCharacter!;
      const hasVisualAid = !!scene.visualAid && visualAidMap[scene.visualAid] && (scene.type === 'dialogue');

      // Determine the layout for the character container
      // If there's a visual aid, keep them spread. If not, bring them closer.
      const characterContainerLayoutClass = hasVisualAid 
        ? "justify-around" // Spread out if there's a visual aid
        : "justify-center md:justify-evenly"; // Center on mobile, more evenly spaced on md+ but not full spread

      return (
        <div 
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/${scene.background}.png)` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>

          <div className={`relative z-10 flex flex-col h-full p-2 sm:p-3 md:p-4 overflow-y-auto ${!hasVisualAid ? 'justify-center' : 'justify-between'}`}> 
            {/* If no visual aid, main container tries to center its content vertically */}
            
            {/* Character Container: Apply dynamic layout class */}
            <div className={`flex flex-col md:flex-row ${characterContainerLayoutClass} items-start md:items-center w-full gap-2 md:gap-4 flex-shrink-0`}>
                {renderCharacterWithBubble(leftChar, 'left')}
                {renderCharacterWithBubble(rightChar, 'right')}
            </div>

            {/* Visual Aid Container: Only takes space if visual aid is present */}
            {hasVisualAid && (
                <div className="flex flex-grow justify-center items-center my-2 md:my-4 min-h-0"> 
                    {renderVisualAid(scene.visualAid)}
                </div>
            )}
            {/* If no visual aid, and we want characters more centered vertically, 
                we might not need a flex-grow spacer here, or a smaller one. 
                The parent 'justify-center' will handle it. */}
            {!hasVisualAid && <div className="flex-grow-0 sm:flex-grow-[0.2] md:flex-grow-[0.3]"></div> /* Optional: small spacer to prevent characters sticking to top if screen is very tall */}
          </div>
        </div>
      );
    } else {
      // Fallback to the original layout for other types of dialogue scenes
      return (
        <div 
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/${scene.background}.png)` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <div className="absolute inset-0 flex flex-col justify-around p-2 sm:p-4 md:p-6">
            <div className="flex flex-col md:flex-row flex-grow items-center justify-around gap-2 md:gap-4">
              {renderCharacter(scene.leftCharacter, "md:ml-4", "left")}
              <div className="flex-grow flex flex-col items-center justify-center my-2 md:my-0">
                {scene.centralDialogue && scene.centralDialogue.active && (
                  <div className="bg-white p-2 sm:p-3 rounded-lg border border-amber-300 max-w-xs text-center shadow-lg">
                    <p className="text-xs sm:text-sm font-quicksand">{scene.centralDialogue.content}</p>
                  </div>
                )}
                {scene.visualAid && (!scene.centralDialogue || !scene.centralDialogue.active) && (
                  <div className="shadow-lg my-2">
                    {renderVisualAid(scene.visualAid)}
                  </div>
                )}
              </div>
              {renderCharacter(scene.rightCharacter, "md:mr-4", "right")}
            </div>
          </div>
        </div>
      );
    }
  };


  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden"> 
      <nav className="bg-[#F8AB28] h-14 sm:h-16 flex justify-between items-center px-3 sm:px-6 md:px-10 lg:px-14 shadow-md z-20 flex-shrink-0">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
          >
            <img src="/icons/home.svg" alt="Home" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />
          </button>
          {currentScene.type !== 'intro' && (
            <div className="flex flex-col items-start justify-center ml-2 sm:ml-3 gap-[2px]">
              <span className="text-[#070C02] text-[10px] sm:text-xs md:text-sm font-quicksand font-normal leading-none">Story 1</span>
              <span className="text-[#070C02] text-[10px] sm:text-xs md:text-sm font-quicksand font-semibold leading-none">Bitcoin Basics</span>
            </div>
          )}
        </div>
        <button className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white">
          {/*<img src="/icons/profile.svg" alt="Profile" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" />*/}
        </button>
      </nav>

      <div className="flex-grow relative flex flex-col overflow-hidden">
        <div className={`overflow-hidden flex-grow relative flex flex-col`}> 
          {currentScene.type === 'intro' 
            ? renderIntroScene(currentScene)
            : renderDialogueScene(currentScene)
          }
          {currentScene.type !== 'intro' && firstDialogueSceneIndex !== -1 && (
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 flex gap-2 z-30">
              {currentSceneIndex > firstDialogueSceneIndex && (
                <button
                  onClick={goToPrevScene}
                  className="p-1 sm:p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                  aria-label="Previous Scene"
                >
                  <img src="/icons/arrow-left.svg" alt="Previous" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </button>
              )}
              {(lastDialogueSceneIndex === -1 || currentSceneIndex < lastDialogueSceneIndex) && (
                 currentSceneIndex < dialogueData.scenes.length -1 && 
                <button
                  onClick={goToNextScene}
                  className="p-1 sm:p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                  aria-label="Next Scene"
                >
                  <img src="/icons/arrow-right.svg" alt="Next" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {currentScene.type === 'dialogue' && !showQuizModal && firstDialogueSceneIndex !== -1 && lastDialogueSceneIndex !== -1 && lastDialogueSceneIndex >= firstDialogueSceneIndex && (
        <div 
          className={`absolute bottom-0 left-0 w-full h-1 sm:h-1.5 bg-gray-200 overflow-hidden z-20 transition-opacity duration-1000 ${progressFading ? 'opacity-0' : 'opacity-100'}`}
          style={{ transition: 'opacity 1.5s ease-out' }}
        >
          <div 
            className={`h-full bg-[#f0ad4e] transition-all duration-500 ease-out ${progressPulse ? 'pulse-animation' : ''}`}
            style={{
              width: `${Math.max(
                5, 
                ((currentSceneIndex - firstDialogueSceneIndex) / 
                Math.max(1, lastDialogueSceneIndex - firstDialogueSceneIndex)) * 100 
              )}%`,
              boxShadow: progressPulse ? '0 0 10px 3px rgba(240, 173, 78, 0.7)' : 'none'
            }}
          />
        </div>
      )}
      
      {confettiActive && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={width < 768 ? 150 : 300} 
          gravity={0.15}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, pointerEvents: 'none' }}
        />
      )}

      {(currentSceneIndex === lastDialogueSceneIndex && currentScene.type === 'dialogue' && !showQuizModal && lastDialogueSceneIndex !== -1) && (
        <img
          src="/images/gifs/clapping_hands.gif" 
          alt="Clapping hands"
          style={{
            position: 'fixed', bottom: '0', left: '50%', transform: 'translateX(-50%)',
            width: '80%', maxWidth: '400px', maxHeight: '30vh', 
            objectFit: 'contain', zIndex: 60, pointerEvents: 'none' 
          }}
        />
      )}

      {showQuizModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', 
            backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100, padding: '1rem'
          }}
        >
          <button
            onClick={() => navigate('/quiz-question/1')} 
            className="bg-[#FFD700] hover:bg-amber-400 text-gray-800 font-bold rounded-xl shadow-xl
                       py-3 px-6 sm:py-4 sm:px-8 
                       text-base sm:text-lg md:text-xl 
                       transition-colors duration-150"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            Proceed to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Story;