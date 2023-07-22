import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';

export type Guess = {
  trueAzimuth: number;
  trueElevation: number;
  guessedAzimuth: number;
  guessedElevation: number;
  library: SupportedLibrary;
  guessStart: number;
  guessEnd: number;
};

interface TestStore {
  guesses: readonly Guess[];
  stepsPerLibrary: number;
  experimentLibraries: readonly SupportedLibrary[];
  libraryOrder: readonly SupportedLibrary[];
  azimuthGuess: number;
  elevationGuess: number;
  currentStep: number;
  currentLibrary: SupportedLibrary;
  isTestFinished: boolean;
  testStart: number;
  testEnd: number;
  currentGuessStart: number;
  reset: () => void;
  setTestStart: (number: number) => void;
  setTestEnd: (number: number) => void;
  setCurrentGuessStart: (number: number) => void;
  addGuess: (guess: Guess) => void;
  clearGuesses: () => void;
  setStepsPerLibrary: (steps: number) => void;
  setLibraryOrder: (order: readonly SupportedLibrary[]) => void;
  setExperimentLibraries: (libraries: readonly SupportedLibrary[]) => void;
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
  experimentLibraries: [
    'web-api',
    'resonance',
    'omnitone',
    'js-ambisonics',
  ] as const,
  libraryOrder: ['web-api', 'resonance', 'omnitone', 'js-ambisonics'] as const,
  azimuthGuess: 0,
  elevationGuess: 0,
  currentStep: 0,
  currentLibrary: 'web-api' as const,
  isTestFinished: false,
  testStart: 0,
  testEnd: 0,
  currentGuessStart: 0,
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
      setTestStart: (testStart) => {
        set({ testStart });
      },
      setTestEnd: (testEnd) => {
        set({ testEnd });
      },
      setCurrentGuessStart: (currentGuessStart) => {
        set({ currentGuessStart });
      },
      clearGuesses: () => {
        set({ guesses: [] });
      },
      setLibraryOrder: (order) => {
        set({ libraryOrder: order });
      },
      setExperimentLibraries: (libraries) => {
        if (libraries.length !== 0) {
          set({ experimentLibraries: libraries });
        }
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
