import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';

type Guess = {
  trueAzimuth: number;
  trueElevation: number;
  guessedAzimuth: number;
  guessedElevation: number;
  library: SupportedLibrary;
};

interface TestStore {
  guesses: Guess[];
  stepsPerLibrary: number;
  libraryOrder: readonly SupportedLibrary[];
  azimuthGuess: number;
  elevationGuess: number;
  currentStep: number;
  currentLibrary: SupportedLibrary;
  isTestFinished: boolean;
  reset: () => void;
  addGuess: (guess: Guess) => void;
  clearGuesses: () => void;
  setStepsPerLibrary: (steps: number) => void;
  setLibraryOrder: (order: readonly SupportedLibrary[]) => void;
  setGuessedDirections: (azimuth: number, elevation: number) => void;
  setGuessedAzimuth: (azimuth: number) => void;
  setGuessedElevation: (elevation: number) => void;
  setCurrentStep: (step: number) => void;
  incrementCurrentStep: () => void;
  setCurrentLibrary: (library: SupportedLibrary) => void;
  setIsTestFinished: (isTestFinished: boolean) => void;
  clearCurrentGuess: () => void;
}

export const INITIAL_STORE = {
  guesses: [],
  stepsPerLibrary: 10,
  libraryOrder: ['web-api', 'resonance', 'omnitone', 'js-ambisonics'] as const,
  azimuthGuess: 0,
  elevationGuess: 0,
  currentStep: 0,
  currentLibrary: 'web-api' as const,
  isTestFinished: false,
};

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STORE,
      reset: () => {
        set(INITIAL_STORE);
      },
      addGuess: (guess) => {
        set({ guesses: [...get().guesses, guess] });
      },
      clearGuesses: () => {
        set({ guesses: [] });
      },
      setLibraryOrder: (steps) => {
        set({ libraryOrder: steps });
      },
      setStepsPerLibrary: (stepsCount) => {
        set({ stepsPerLibrary: stepsCount });
      },
      setGuessedDirections: (azimuth, elevation) => {
        set({ azimuthGuess: azimuth, elevationGuess: elevation });
      },
      setGuessedAzimuth: (azimuth) => {
        set({ azimuthGuess: azimuth });
      },
      setGuessedElevation: (elevation) => {
        set({ elevationGuess: elevation });
      },
      setCurrentStep: (step) => {
        set({ currentStep: step });
      },
      incrementCurrentStep: () => {
        set({ currentStep: get().currentStep + 1 });
      },
      setCurrentLibrary: (library) => {
        set({ currentLibrary: library });
      },
      setIsTestFinished: (isTestFinished) => {
        set({ isTestFinished });
      },
      clearCurrentGuess: () => {
        set({ azimuthGuess: 0, elevationGuess: 0 });
      },
    }),
    {
      name: 'test-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
