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

export interface StoryData {
  scenes: Scene[];
}
