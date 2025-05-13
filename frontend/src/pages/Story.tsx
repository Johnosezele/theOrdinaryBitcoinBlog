import { useState } from 'react';
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
  // Map over the scenes and make sure they have the correct type
  const processedScenes = data.scenes.map((scene: RawScene): Scene => {
    // Validate scene type
    if (!isValidSceneType(scene.type)) {
      throw new Error(`Invalid scene type: ${scene.type}`);
    }
    
    // Return the processed scene with correct types
    return {
      ...scene,
      type: scene.type
    };
  });

  return {
    scenes: processedScenes
  };
};

// Process the dialogue data
const dialogueData = processDialogueData(rawDialogueData as RawDialogueData);

// Define the mapping outside the component or memoize it if inside
const visualAidMap: { 
  [key: string]: { 
    src: string | null; 
    alt: string; 
    displaySize?: 'small' | 'medium' | 'large'; // Added display size
  } 
} = {
  "blockchain-diagram": {
    src: "/images/visual-aids/blockchain-diagram.png",
    alt: "Blockchain diagram illustration",
    displaySize: 'medium', // Explicitly medium
  },
  "bitcoin-ledger": {
    src: "/images/visual-aids/bitcoin-ledger.png", 
    alt: "Bitcoin ledger illustration",
    displaySize: 'medium', // Defaulting to medium
  },
  "blockchain-illustration": {
    src: "/images/visual-aids/blochain_illustration.png", 
    alt: "Illustration explaining blockchain",
    displaySize: 'large',
  },
  "bitcoin-padlock": {
    src: "/images/visual-aids/bitcoin_padlock.png", 
    alt: "Illustration of Bitcoin security with a padlock",
    displaySize: 'large', 
  },
  "bitcoin-mining": {
    src: "/images/visual-aids/bitcoin_mining.png", 
    alt: "Illustration of Bitcoin mining",
    displaySize: 'medium',
  },
  "bitcoin-reward": {
    src: "/images/visual-aids/bitcoin_reward.png",
    alt: "Illustration of Bitcoin reward",
    displaySize: 'medium',
  },
  "bitcoin-puzzle": {
    src: "/images/visual-aids/bitcoin_puzzle.png",
    alt: "Illustration of Bitcoin puzzle",
    displaySize: 'medium',
  },
  "bitcoin-block": {
    src: "/images/visual-aids/bitcoin_block.png",
    alt: "Illustration of Bitcoin block",
    displaySize: 'medium',
  },
};

const Story = () => {
  // Track the current scene index
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  
  // Get the current scene data
  const currentScene = dialogueData.scenes[currentSceneIndex];

  // Compute first and last dialogue scene indices for navigation arrows
  const firstDialogueSceneIndex = dialogueData.scenes.findIndex(scene => scene.type === 'dialogue');
  const lastDialogueSceneIndex = (() => {
    const reversedIndex = [...dialogueData.scenes].reverse().findIndex(scene => scene.type === 'dialogue');
    return reversedIndex === -1 ? -1 : dialogueData.scenes.length - 1 - reversedIndex;
  })();
  
  const goToNextScene = () => {
    if (currentSceneIndex < dialogueData.scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const goToPrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  // Helper function to render the visual aid
  const renderVisualAid = (type: string | null | undefined) => {
    if (!type || !visualAidMap[type]) return null;

    const aidData = visualAidMap[type];
    const size = aidData.displaySize || 'medium'; // Default to medium

    // Determine container class based on size
    let sizeClass = '';
    switch (size) {
      case 'small':
        sizeClass = 'max-w-sm'; // Example: max-width 24rem
        break;
      case 'large':
        sizeClass = 'max-w-lg'; // Example: max-width 32rem
        break;
      case 'medium':
      default:
        sizeClass = 'max-w-md'; // Example: max-width 28rem
        break;
    }
    
    const visualAidBaseContainerClasses = " p-4 rounded-lg mx-auto"; // Removed width/border, handled by size + image
    const visualAidImageClasses = "w-full h-auto object-contain shadow-lg rounded-lg"; // Added shadow/rounding to image itself

    return (
      // Apply base classes and dynamic size class
      <div className={`${visualAidBaseContainerClasses} ${sizeClass}`}>
        {aidData.src ? (
          <img
            src={aidData.src}
            alt={aidData.alt}
            className={visualAidImageClasses}
          />
        ) : (
          // Render placeholder text if no image source is defined
          <p className="text-center text-gray-500 italic h-40 flex items-center justify-center border border-dashed border-gray-400 rounded-lg">{aidData.alt}</p>
        )}
      </div>
    );
  };

  // Function to render a character with dialogue bubble (Figma style)
  const renderCharacterWithBubble = (
    character: Character | undefined,
    position: 'left' | 'right'
  ) => {
    if (!character) return null;

    // Set image file based on character data
    const imageSrc = `/images/characters/${character.image}`;
      
    // Different styling based on position
    const containerClass = position === 'left'
      ? "flex items-center" 
      : "flex items-center flex-row-reverse"; // Dialogue bubble renders before avatar for right character
    
    // Determine character size: from JSON, or default based on position
    const defaultSize = position === 'left' ? 'small' : 'large';
    const currentSize = character.size || defaultSize;

    const avatarSizeClass = currentSize === 'large'
      ? "w-40 h-40 md:w-80 md:h-80" // Larger size
      : "w-32 h-32 md:w-50 md:h-50"; // Smaller size
      
    const bubbleClass = position === 'left'
      ? "ml-3 max-w-[260px]" 
      : "mr-3 max-w-[260px]";
      
    const textSizeClass = currentSize === 'large'
      ? "text-xl" // Larger text
      : "text-lg"; // Smaller text

    return (
      <div className={`${containerClass} gap-4 my-6`}>
        {/* Character Avatar */}
        <div className={`${avatarSizeClass} rounded-full overflow-hidden shadow-md`}>
          <img src={imageSrc} alt={character.emotion || 'character'} className="w-full h-full object-cover" />
        </div>
        
        {/* Dialogue Bubble - only show if active and dialogue exists */}
        {character.dialogueActive && character.dialogue && (
          <div className={`px-4 py-3 bg-[#FFF8F1] border-2 border-[#F8AB28] rounded-xl shadow font-quicksand ${textSizeClass} text-[#070C02] ${bubbleClass} ${position === 'right' ? 'text-left' : ''}`}>
            {character.dialogue}
          </div>
        )}
      </div>
    );
  };
  
  // Original renderCharacter function (keeping for compatibility)
  const renderCharacter = (character: Character | undefined, position: string, characterType: 'left' | 'right') => {
    if (!character) return null;
    
    // Construct the image source directly from the character's image property in the JSON
    // Ensure your character image files are in public/images/characters/
    // and their names match what's in story1.json (e.g., character1-neutral.png)
    const imageSrc = `/images/characters/${character.image}`;
    
    return (
      <div className={`flex flex-col items-center ${position}`}>
        {/* Character image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#F8AB28] bg-white shadow-md">
          <img src={imageSrc} alt={`Character ${characterType}`} className="w-full h-full object-cover" />
        </div>
        
        {/* Dialogue bubble - only show if active */}
        {character.dialogueActive && character.dialogue && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-300 shadow-lg max-w-xs">
            <p className="text-sm font-quicksand">{character.dialogue}</p>
          </div>
        )}
      </div>
    );
  };
  
  // Render intro scene (landing page)
  const renderIntroScene = (scene: Scene) => {
    return (
      <div className="relative flex-1">
        {/* Background image (cafe) */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage:`url(/images/${scene.background}.png)` // Assuming background images are .png
          }}
        >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        
        {/* Content - Left Aligned with Corrected Container and Button */}
        <div className="absolute inset-0 flex flex-col justify-end bottom-0 left-0 p-8 md:p-12 lg:p-16 items-start z-10 pl-16 pr-4 md:pl-20 text-white lg:pl-24">
          <h1
            className="text-4xl font-bold mb-2 md:mb-3 text-left"
            style={{ fontFamily: 'Quicksand, sans-serif' }} 
          >
            {scene.title}
          </h1>
          <p
            className="text-lg mb-3 md:mb-4 max-w-xl text-left"
            style={{ fontFamily: 'Quicksand, sans-serif' }} 
          >
            {scene.subtitle}
          </p>
          <p
            className="text-sm mb-6 md:mb-8 opacity-90 text-left"
            style={{ fontFamily: 'Quicksand, sans-serif' }} 
          >
            Duration: {scene.duration || '5 min'}
          </p>
          <button
            onClick={goToNextScene}
            className="absolute flex justify-center items-center bg-[#F02B6C] hover:bg-pink-700 text-white font-bold rounded-[5px]"
            style={{
              left: 1094,
              bottom: 140,
              width: 153, 
              height: 44,
              padding: '12px 20px',
              gap: 10,
              fontFamily: 'Quicksand', 
              fontWeight: 700,
              fontSize: 16, 
              lineHeight: '20px'
            }}
          >
            {scene.ctaButton}
          </button>
        </div>
      </div>
    );
  };
  
  // Render dialogue scene
  const renderDialogueScene = (scene: Scene) => {
    // Determine if this scene should use the new Figma-style two-character layout
    const useFigmaStyleLayout = 
      scene.leftCharacter && 
      scene.rightCharacter && 
      (scene.leftCharacter.dialogueActive || scene.rightCharacter.dialogueActive) &&
      !scene.centralDialogue?.active; // Also ensure central dialogue isn't the focus

    if (useFigmaStyleLayout) {
      const leftChar = scene.leftCharacter!;
      const rightChar = scene.rightCharacter!;
      const hasVisualAid = !!scene.visualAid && (scene.type === 'dialogue'); // Ensure visual aid is for dialogue type

      return (
        <div 
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/${scene.background}.png)` }}
        >
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-black opacity-60"></div>

          {/* Character and dialogue layout container */}
          {/* Using justify-center for vertical centering of the block */}
          <div className={`relative z-10 flex h-full flex-col justify-center`}> 
            
            {/* Characters Container - Removed items-start and bottom padding */}
            <div
              className={`flex justify-between w-full px-10 md:px-16`}
            >
              <div className="flex flex-col justify-center">
                {renderCharacterWithBubble(leftChar, 'left')}
              </div>
              <div className="flex flex-col justify-center">
                {renderCharacterWithBubble(rightChar, 'right')}
              </div>
            </div>

            {/* Visual Aid - rendered below characters if active */}
            {hasVisualAid && (
              // Re-added a small top margin to control spacing
              <div className="flex justify-center items-center mt-2"> 
                {renderVisualAid(scene.visualAid)}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Fallback to the original layout for other types of dialogue scenes
      // (e.g., scenes with central dialogue, or single character focus if any)
      return (
        <div 
          className="relative flex-1 bg-cover bg-center"
          style={{ backgroundImage: `url(/images/${scene.background}.png)` }}
        >
          <div className="absolute inset-0 bg-black opacity-60"></div> {/* Original overlay */}
          
          {/* Original layout structure from before */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-8">
            <div className="flex flex-grow items-center justify-around">
              {/* Left character (using original renderCharacter) */}
              {renderCharacter(scene.leftCharacter, "ml-4 md:ml-8", "left")}
              
              {/* Central content wrapper */}
              <div className="flex-grow flex items-center justify-center">
                {/* Central dialogue (if active) */}
                {scene.centralDialogue && scene.centralDialogue.active && (
                  <div className="bg-white p-4 rounded-lg border border-amber-300 max-w-xs text-center shadow-lg">
                    <p className="text-sm font-quicksand">{scene.centralDialogue.content}</p>
                  </div>
                )}
                
                {/* Visual Aid */}
                {scene.visualAid && (!scene.centralDialogue || !scene.centralDialogue.active) && (
                  <div className="shadow-lg">
                    {renderVisualAid(scene.visualAid)}
                  </div>
                )}
              </div>
              
              {/* Right character (using original renderCharacter) */}
              {renderCharacter(scene.rightCharacter, "mr-4 md:mr-8", "right")}
            </div>
          </div>
        </div>
      );
    }
  };

  // Main render function
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden"> 
      {/* Top Navigation Bar */}
      <nav className="bg-[#F8AB28] h-16 flex justify-between items-center px-14 shadow-md z-20">
        {/* Left group: Home + Story Info */}
        <div className="flex items-center">
          <button className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white ml-2">
            <img src="/icons/home.svg" alt="Home" className="w-10 h-10" />
          </button>
          {currentScene.type !== 'intro' && (
            <div className="flex flex-col items-start justify-center ml-2 gap-[3px]">
              <span className="text-[#070C02] text-[14px] font-quicksand font-normal leading-none">Story 1</span>
              <span className="text-[#070C02] text-[14px] font-quicksand font-semibold leading-none">Bitcoin Basics</span>
            </div>
          )}
        </div>
        {/* Profile Icon Button */}
        <button className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white mr-2">
          <img src="/icons/profile.svg" alt="Profile" className="w-10 h-10" />
        </button>
      </nav>

      {/* Content Area Below Nav Bar */}
      {/* Compute first and last dialogue scene indices for navigation arrows */}
      
      <div className="absolute inset-0 top-16 flex flex-col"> 
        {/* Scene information (only visible for non-intro scenes) */}

        {/* Main content - changes based on scene type */}
        <div className={`overflow-hidden flex-grow relative flex flex-col ${currentScene.type === 'intro' ? 'mb-0' : ''}`}> 
          {currentScene.type === 'intro' 
            ? renderIntroScene(currentScene)
            : renderDialogueScene(currentScene)
          }

          {/* Navigation Arrows - Conditionally Rendered & Absolutely Positioned within this container */}
          {currentScene.type !== 'intro' && (
            <>
              {/* Only the right arrow on the first dialogue scene */}
              {currentSceneIndex === firstDialogueSceneIndex && (
                <button
                  onClick={goToNextScene}
                  className="absolute bottom-4 right-4 z-30 p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                  aria-label="Next Scene"
                >
                  <img src="/icons/arrow-right.svg" alt="Next" className="w-7 h-7 md:w-8 md:h-8" />
                </button>
              )}

              {/* Both arrows on middle dialogue scenes */}
              {currentSceneIndex > firstDialogueSceneIndex && currentSceneIndex < lastDialogueSceneIndex && (
                <div className="absolute bottom-4 right-4 flex gap-3 z-30">
                  <button
                    onClick={goToPrevScene}
                    className="p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                    aria-label="Previous Scene"
                  >
                    <img src="/icons/arrow-left.svg" alt="Previous" className="w-7 h-7 md:w-8 md:h-8" />
                  </button>
                  <button
                    onClick={goToNextScene}
                    className="p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                    aria-label="Next Scene"
                  >
                    <img src="/icons/arrow-right.svg" alt="Next" className="w-7 h-7 md:w-8 md:h-8" />
                  </button>
                </div>
              )}

              {/* Only the left arrow on the last dialogue scene */}
              {currentSceneIndex === lastDialogueSceneIndex && (
                <button
                  onClick={goToPrevScene}
                  className="absolute bottom-4 right-[75px] z-30 p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors"
                  aria-label="Previous Scene"
                >
                  <img src="/icons/arrow-left.svg" alt="Previous" className="w-7 h-7 md:w-8 md:h-8" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;