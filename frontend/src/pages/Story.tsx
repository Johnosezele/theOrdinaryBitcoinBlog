import { useState } from 'react';
import rawDialogueData from '../data/story1.json';

interface Character {
  image: string;
  emotion: string;
  dialogueActive: boolean;
  dialogue: string;
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
  };
  rightCharacter?: {
    image: string;
    emotion: string;
    dialogueActive: boolean;
    dialogue: string;
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

// Character images based on emotion *Placeholder - need to add real images*
const characterImages = {
  character1: {
    neutral: "/api/placeholder/120/120",
    thinking: "/api/placeholder/120/120",
    confused: "/api/placeholder/120/120",
    curious: "/api/placeholder/120/120"
  },
  character2: {
    neutral: "/api/placeholder/120/120",
    explaining: "/api/placeholder/120/120",
    teaching: "/api/placeholder/120/120"
  }
};

const Story = () => {
  // Track the current scene index
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  
  // Get the current scene data
  const currentScene = dialogueData.scenes[currentSceneIndex];
  
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
    if (!type) return null;

    if (type === "blockchain-diagram") {
      return (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 w-64 mx-auto">
          <div className="flex justify-center items-center">
            <div className="text-3xl text-teal-500">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10a2 2 0 0 1 2 2v1M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 17H7a2 2 0 0 1-2-2v-1M17 17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1M17 17V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-3xl text-teal-500 mx-2">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10a2 2 0 0 1 2 2v1M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 17H7a2 2 0 0 1-2-2v-1M17 17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1M17 17V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-3xl text-teal-500">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 7h10a2 2 0 0 1 2 2v1M7 7V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1M7 7v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 17H7a2 2 0 0 1-2-2v-1M17 17v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1M17 17V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-bold text-center mt-2">BLOCKCHAIN</h2>
        </div>
      );
    } else if (type === "bitcoin-ledger") {
      return (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-300 w-64 mx-auto">
          <div className="flex justify-center relative">
            <div className="bg-blue-100 p-2 rounded border border-blue-300 w-48">
              <div className="flex items-center mb-2">
                <div className="bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-1">₿</div>
                <div className="bg-gray-200 h-2 flex-1 rounded"></div>
              </div>
              <div className="flex items-center mb-2">
                <div className="bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-1">₿</div>
                <div className="bg-gray-200 h-2 flex-1 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-1">₿</div>
                <div className="bg-gray-200 h-2 flex-1 rounded"></div>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="bg-gray-500 rounded p-1">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Helper function to render character with dialogue
  const renderCharacter = (character: Character | undefined, position: string, characterType: 'left' | 'right') => {
    if (!character) return null;
    
    // Get the image based on character type and emotion
    const imageSrc = characterType === 'left' 
      ? characterImages.character1[character.emotion as keyof typeof characterImages.character1] 
      : characterImages.character2[character.emotion as keyof typeof characterImages.character2];
    
    return (
      <div className={`flex flex-col items-center ${position}`}>
        {/* Character image */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-400 bg-white">
          <img src={imageSrc} alt={`Character ${characterType}`} className="w-full h-full object-cover" />
        </div>
        
        {/* Dialogue bubble - only show if active */}
        {character.dialogueActive && character.dialogue && (
          <div className="mt-2 p-3 bg-white rounded-lg border border-gray-300 max-w-xs">
            <p className="text-sm">{character.dialogue}</p>
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
            backgroundImage:`url(/images/cafe.png)`
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
    return (
      <div className="relative min-h-96 p-4">
        {/* Background elements - café environment */}
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage:`url(/images/cafe.png)`
          }}
        >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>

        {/* Character circles and dialogue */}
        <div className="flex justify-between items-center relative z-10 pt-12 px-8 min-h-72">
          {/* Left character */}
          {renderCharacter(scene.leftCharacter, "ml-4", "left")}
          
          {/* Central dialogue (if active) */}
          {scene.centralDialogue && scene.centralDialogue.active && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg border border-amber-300 max-w-xs text-center z-20">
              <p className="text-sm">{scene.centralDialogue.content}</p>
            </div>
          )}
          
          {/* Visual Aid (if present) */}
          {scene.visualAid && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              {renderVisualAid(scene.visualAid)}
            </div>
          )}
          
          {/* Right character */}
          {renderCharacter(scene.rightCharacter, "mr-4", "right")}
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden"> 
      {/* Top Navigation Bar */}
      <nav className="bg-[#F8AB28] h-16 flex justify-between items-center px-14 shadow-md z-20">
        {/* Home Icon Button */}
        <button className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white ml-2">
          <img src="/icons/home.svg" alt="Home" className="w-10 h-10" />
        </button>
        {/* Profile Icon Button */}
        <button className="p-1 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white mr-2">
          <img src="/icons/profile.svg" alt="Profile" className="w-10 h-10" />
        </button>
      </nav>

      {/* Content Area Below Nav Bar */}
      <div className="absolute inset-0 top-16 flex flex-col"> 
        {/* Scene information (only visible for non-intro scenes) */}
        {currentScene.type !== "intro" && (
          <div className="text-center mb-4 text-gray-600">
            Story {currentScene.storyNumber} | Scene {currentScene.sceneNumber}
          </div>
        )}

        {/* Main content - changes based on scene type */}
        <div className={`overflow-hidden flex-grow relative flex flex-col ${currentScene.type === 'intro' ? 'mb-0' : 'rounded-lg shadow-md mb-4 bg-amber-50'}`}> 
          {currentScene.type === 'intro' 
            ? renderIntroScene(currentScene)
            : renderDialogueScene(currentScene)
          }

          {/* Navigation Arrows - Conditionally Rendered & Absolutely Positioned within this container */}
          {currentScene.type !== 'intro' && (
            <>
              {/* Previous Arrow Button */}
              <button
                onClick={goToPrevScene}
                disabled={currentSceneIndex === 0}
                className="absolute bottom-4 left-4 z-30 p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous Scene"
              >
                <img src="/icons/arrow-left.svg" alt="Previous" className="w-7 h-7 md:w-8 md:h-8" />
              </button>

              {/* Next Arrow Button */}
              <button
                onClick={goToNextScene}
                disabled={currentSceneIndex === dialogueData.scenes.length - 1}
                className="absolute bottom-4 right-4 z-30 p-2 rounded-full text-white hover:bg-black hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next Scene"
              >
                <img src="/icons/arrow-right.svg" alt="Next" className="w-7 h-7 md:w-8 md:h-8" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;