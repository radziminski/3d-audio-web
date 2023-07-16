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
  reset: () => void;
  addGuess: (guess: Guess) => void;
  setStepsPerLibrary: (steps: number) => void;
  setLibraryOrder: (order: readonly SupportedLibrary[]) => void;
  setGuessedDirections: (azimuth: number, elevation: number) => void;
  setGuessedAzimuth: (azimuth: number) => void;
  setGuessedElevation: (elevation: number) => void;
}

export const INITIAL_STORE = {
  guesses: [],
  stepsPerLibrary: 10,
  libraryOrder: ['web-api', 'resonance', 'omnitone', 'js-ambisonics'] as const,
  azimuthGuess: 0,
  elevationGuess: 0,
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
    }),
    {
      name: 'test-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
