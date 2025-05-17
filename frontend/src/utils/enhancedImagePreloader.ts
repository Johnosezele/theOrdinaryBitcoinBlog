// Define types directly to avoid import issues
export interface Character {
  image: string;
  emotion: string;
  dialogueActive: boolean;
  dialogue?: string;
  size?: 'small' | 'large';
}

export interface CentralDialogue {
  active: boolean;
  content: string;
}

export interface Scene {
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
  visualAid?: string;
}

// Set to track image URLs that have been attempted to be preloaded
const processedImageUrls = new Set<string>();

// Set to track image URLs that failed to load
const failedImageUrls = new Set<string>();

// Group images by priority
export const priorityGroups = {
  // Critical images needed for initial app rendering (home page, auth pages)
  critical: [
    '/images/bob_carol.svg',
    '/images/cafe.png',
    '/icons/home.svg',
    '/icons/google.svg',
    '/icons/github.svg',
    '/icons/email.svg',
  ],
  
  // First scene images (intro and first dialogue)
  firstScene: [
    '/images/characters/bob_excited.png',
    '/images/characters/carol_excited.png',
  ],
  
  // Character base images (frequently used throughout)
  commonCharacters: [
    '/images/characters/bob_explaining.png',
    '/images/characters/carol_explaining.png',
    '/images/characters/bob_neutral.png',
    '/images/characters/carol_listening.png',
  ],
  
  // Common visual aids used in early scenes
  earlyVisualAids: [
    '/images/visual-aids/blockchain-diagram.png',
    '/images/visual-aids/bitcoin_key.png',
  ]
};

/**
 * Preloads a specific set of images
 * @param imagePaths Array of image paths to preload
 * @param progressCallback Optional callback to track loading progress
 * @returns A promise that resolves when all specified images are loaded
 */
export const preloadImages = (
  imagePaths: string[], 
  progressCallback?: (loaded: number, total: number) => void
): Promise<void[]> => {
  // Filter out already processed images
  const uniquePaths = imagePaths.filter(path => !processedImageUrls.has(path));
  const total = uniquePaths.length;
  let loadedCount = 0;
  
  // If all images are already processed, report 100% immediately
  if (total === 0) {
    if (progressCallback) {
      progressCallback(1, 1); // Report 100% immediately
    }
    return Promise.resolve([]);
  }
  
  const imagePromises = uniquePaths.map(src => {
    // Mark as processing
    processedImageUrls.add(src);

    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (progressCallback) {
          progressCallback(loadedCount, total);
        }
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        // Track failed image URL
        failedImageUrls.add(src);
        // Still count towards 'loaded' for progress to complete, even on error
        loadedCount++; 
        if (progressCallback) {
          progressCallback(loadedCount, total);
        }
        resolve(); // Resolve anyway to not block the app
      };
    });
  });
  
  return Promise.all(imagePromises);
};

/**
 * Extracts all image paths from a set of scenes
 * @param scenes Array of scenes to extract images from
 * @returns Array of unique image paths
 */
export const extractImagesFromScenes = (scenes: Scene[]): string[] => {
  const imagePaths = new Set<string>();
  
  scenes.forEach(scene => {
    // Add background
    if (scene.background) {
      imagePaths.add(`/images/${scene.background}.png`);
    }
    
    // Add character images
    if (scene.leftCharacter?.image) {
      imagePaths.add(`/images/characters/${scene.leftCharacter.image}`);
    }
    if (scene.rightCharacter?.image) {
      imagePaths.add(`/images/characters/${scene.rightCharacter.image}`);
    }
    
    // Add visual aid
    if (scene.visualAid) {
      imagePaths.add(`/images/visual-aids/${scene.visualAid}.png`);
    }
  });
  
  return Array.from(imagePaths);
};

/**
 * Preloads images for upcoming scenes based on current scene index
 * @param scenes All scenes in the story
 * @param currentIndex Current scene index
 * @param lookahead Number of scenes to preload ahead
 */
export const preloadUpcomingScenes = (
  scenes: Scene[], 
  currentIndex: number, 
  lookahead: number = 3
): void => {
  // Get upcoming scenes
  const upcomingScenes = scenes.slice(
    currentIndex + 1, 
    Math.min(currentIndex + 1 + lookahead, scenes.length)
  );
  
  // Extract and preload images
  const imagesToPreload = extractImagesFromScenes(upcomingScenes);
  if (imagesToPreload.length > 0) {
    console.log(`Preloading ${imagesToPreload.length} images for upcoming scenes`);
    preloadImages(imagesToPreload);
  }
};

/**
 * Initial loading of critical images
 * @param progressCallback Optional callback to track loading progress
 * @returns Promise that resolves when critical images are loaded
 */
export const loadCriticalImages = (
  progressCallback?: (progress: number) => void
): Promise<void[]> => {
  const criticalImages = [
    ...priorityGroups.critical,
    ...priorityGroups.firstScene
  ];
  
  return preloadImages(
    criticalImages, 
    (loaded, total) => {
      if (progressCallback) {
        progressCallback((loaded / total) * 100);
      }
    }
  );
};

/**
 * Second phase loading of common assets
 * @returns Promise that resolves when common assets are loaded
 */
export const loadCommonAssets = (): Promise<void[]> => {
  const commonAssets = [
    ...priorityGroups.commonCharacters,
    ...priorityGroups.earlyVisualAids
  ];
  
  return preloadImages(commonAssets);
};

/**
 * Returns a Set of image URLs that failed to load
 * @returns Set of failed image URLs
 */
export const getFailedImageUrls = (): Set<string> => {
  return new Set(failedImageUrls); // Return a copy to prevent direct mutation
};

/**
 * Attempts to retry loading previously failed images
 * @param progressCallback Optional callback to track retry progress
 * @returns Promise that resolves when all retries are complete
 */
export const retryFailedImages = (
  progressCallback?: (loaded: number, total: number) => void
): Promise<void[]> => {
  const failedUrls = Array.from(failedImageUrls);
  
  // Clear the failed URLs set before retrying
  failedImageUrls.clear();
  
  // Retry loading these images
  return preloadImages(failedUrls, progressCallback);
};

export default {
  loadCriticalImages,
  loadCommonAssets,
  preloadUpcomingScenes,
  extractImagesFromScenes,
  getFailedImageUrls,
  retryFailedImages
};
