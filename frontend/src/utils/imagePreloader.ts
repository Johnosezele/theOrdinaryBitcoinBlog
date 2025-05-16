// List of all images to preload
const imagesToPreload = [
  // Characters
  '/images/characters/bob_explaining.png',
  '/images/characters/bob_holding_phone.png',
  '/images/characters/bob_excited.png',
  '/images/characters/bob_holding_puzzle.png',
  '/images/characters/bob_knuckle_up.png',
  '/images/characters/bob_neutral.png',
  '/images/characters/bob_smirk.png',
  '/images/characters/bob_teaching.png',
  '/images/characters/bob_thinking_filled.png',
  '/images/characters/carol_asking.png',
  '/images/characters/carol_explaining.png',
  '/images/characters/carol_excited.png',
  '/images/characters/carol_laughing.png',
  '/images/characters/carol_listening.png',
  '/images/characters/carol_question_small.png',
  '/images/characters/carol_question.png',
  '/images/characters/carol_satisfied.png',
  '/images/characters/carol_scared.png',
  '/images/characters/carol_shocked.png',
  '/images/characters/carol_understanding.png',
  '/images/characters/carol_winks.png',
  
  //gifs
  '/images/gifs/clapping_hands.gif',
  
  // Backgrounds
  '/images/cafe.png',
  '/images/bob_carol.svg',
  
  // Visual Aids
  '/images/visual-aids/blockchain-diagram.png',
  '/images/visual-aids/bitcoin_key.png',
  '/images/visual-aids/blochain_illustration.png',
  '/images/visual-aids/bitcoin_padlock.png',
  '/images/visual-aids/bitcoin_mining.png',
  '/images/visual-aids/bitcoin_reward.png',
  '/images/visual-aids/bitcoin_machine.png',
  '/images/visual-aids/bitcoin_block.png',
  '/images/visual-aids/bitcoin_wallet.png',
  '/images/visual-aids/bitcoin_exchange.png',
  '/images/visual-aids/hardware_wallets.png',
  '/images/visual-aids/written_seedphrase.png',
  '/images/visual-aids/mobile_seedphrase.png',
  '/images/visual-aids/bitcoin_address.png',
  '/images/visual-aids/bitcoin_pending.png',
  '/images/visual-aids/bitcoin_confirmed.png',
  
  // Icons
  '/icons/home.svg',
  '/icons/profile.svg',
  '/icons/arrow-left.svg',
  '/icons/arrow-right.svg',
  '/icons/email.svg',
  '/icons/google.svg',
  '/icons/github.svg',
  '/icons/facebook.svg',
  '/icons/twitter.svg'
];

/**
 * Preloads all images for the application
 * @returns A promise that resolves when all images are loaded
 */
export const preloadImages = (): Promise<void[]> => {
  const imagePromises = imagesToPreload.map(src => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        resolve(); // Resolve anyway to not block the app
      };
    });
  });
  
  return Promise.all(imagePromises);
};

/**
 * Preloads a specific set of images
 * @param imagePaths Array of image paths to preload
 * @returns A promise that resolves when all specified images are loaded
 */
export const preloadSpecificImages = (imagePaths: string[]): Promise<void[]> => {
  const imagePromises = imagePaths.map(src => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        resolve(); // Resolve anyway to not block the app
      };
    });
  });
  
  return Promise.all(imagePromises);
};

export default preloadImages;
