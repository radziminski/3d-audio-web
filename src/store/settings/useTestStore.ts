import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { TEST_ANGLES } from '~/hooks/use-test-mode/constants';
import { shuffleArray } from '~/hooks/use-test-mode/useTestMode';

export type Guess = {
  trueAzimuth: number;
  trueElevation: number;
  guessedAzimuth: number;
  guessedElevation: number;
  library: SupportedLibrary;
  guessStart: number;
  guessEnd: number;
};

type Angles = { azimuth: number; elevation: number };

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
  testId: string | undefined;
  testAngles: Angles[];
  isStereoCorrect: boolean;
  isGuessMade: boolean;
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
  setTestId: (testId: string) => void;
  setIsStereoCorrect: () => void;
  setIsGuessMade(isGuessMade: boolean): void;
  resetTestAngles: () => Angles[];
}

export const INITIAL_STORE = {
  guesses: [] as readonly Guess[],
  stepsPerLibrary: 15,
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
  testId: undefined,
  testAngles: TEST_ANGLES as Angles[],
  isStereoCorrect: false,
  isGuessMade: false,
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
      setTestId: (testId) => {
        set({ testId });
      },
      setIsStereoCorrect: () => {
        set({ isStereoCorrect: true });
      },
      setIsGuessMade: (isGuessMade: boolean) => {
        set({ isGuessMade });
      },
      resetTestAngles: () => {
        const { stepsPerLibrary } = get();

        const angles: Angles[] = [];

        const firstSet = shuffleArray(TEST_ANGLES);
        const secondSet = shuffleArray(TEST_ANGLES);
        const thirdSet = shuffleArray(TEST_ANGLES);
        const fourthSet = shuffleArray(TEST_ANGLES);

        for (let i = 0; i < stepsPerLibrary; i++) {
          if (firstSet.length > 0) {
            angles.push(firstSet.pop()!);

            continue;
          }

          if (secondSet.length > 0) {
            angles.push(secondSet.pop()!);

            continue;
          }

          if (thirdSet.length > 0) {
            angles.push(thirdSet.pop()!);

            continue;
          }

          if (fourthSet.length > 0) {
            angles.push(fourthSet.pop()!);
          }
        }
        set({ testAngles: angles });

        return angles;
      },
    }),
    {
      name: 'test-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
