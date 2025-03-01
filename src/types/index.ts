export interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface GameState {
  currentDestination: Destination | null;
  options: Destination[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  score: {
    correct: number;
    incorrect: number;
  };
  username: string;
  isGameStarted: boolean;
  showResult: boolean;
  factToShow: string;
}

export interface UserProfile {
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
}