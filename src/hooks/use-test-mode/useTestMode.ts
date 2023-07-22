import { useCallback } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';
import { SupportedLibrary } from '../use-redirect-to-library/useRedirectToLibrary';
import { useRouter } from 'next/router';

export const SUPPORTED_LIBRARIES: SupportedLibrary[] = [
  'web-api',
  'js-ambisonics',
  'resonance',
  'omnitone',
];

const shuffleArray = <T>(arr: T[]) =>
  arr
    .map((value) => [Math.random(), value] as const)
    .sort(([a], [b]) => a - b)
    .map((entry) => entry[1]);

export const useTestMode = () => {
  const router = useRouter();

  const setRandomAngles = useSettingsStore((state) => state.setRandomAngles);
  const trueAzimuth = useSettingsStore((state) => state.azimuth);
  const trueElevation = useSettingsStore((state) => state.elevation);
  const guessedAzimuth = useTestStore((state) => state.azimuthGuess);
  const guessedElevation = useTestStore((state) => state.elevationGuess);

  const addGuess = useTestStore((state) => state.addGuess);
  const incrementStep = useTestStore((state) => state.incrementCurrentStep);
  const setCurrentLibrary = useTestStore((state) => state.setCurrentLibrary);
  const setIsTestFinished = useTestStore((state) => state.setIsTestFinished);
  const setCurrentStep = useTestStore((state) => state.setCurrentStep);
  const setLibraryOrder = useTestStore((state) => state.setLibraryOrder);
  const clearGuesses = useTestStore((state) => state.clearGuesses);
  const clearCurrentGuess = useTestStore((state) => state.clearCurrentGuess);
  const setTestStart = useTestStore((state) => state.setTestStart);
  const setTestEnd = useTestStore((state) => state.setTestEnd);
  const setGuessStart = useTestStore((state) => state.setCurrentGuessStart);
  const currentGuessStart = useTestStore((state) => state.currentGuessStart);
  const currentLibrary = useTestStore((state) => state.currentLibrary);
  const currentStep = useTestStore((state) => state.currentStep);
  const stepsPerLibrary = useTestStore((state) => state.stepsPerLibrary);
  const libraryOrder = useTestStore((state) => state.libraryOrder);
  const experimentLibraries = useTestStore(
    (state) => state.experimentLibraries
  );

  const currentLibraryIndex = libraryOrder.indexOf(currentLibrary);

  const handleStartTest = useCallback(() => {
    setIsTestFinished(false);
    setCurrentStep(0);
    const randomLibraryOrder = shuffleArray([...experimentLibraries]);
    setLibraryOrder(randomLibraryOrder);
    clearGuesses();
    setRandomAngles();
    clearCurrentGuess();
    setTestStart(Date.now());

    const newLibrary = randomLibraryOrder[0];
    setCurrentLibrary(newLibrary);
    router.push(`/library-redirect?library=${newLibrary}`);
  }, [
    clearCurrentGuess,
    clearGuesses,
    experimentLibraries,
    router,
    setCurrentLibrary,
    setCurrentStep,
    setIsTestFinished,
    setLibraryOrder,
    setRandomAngles,
    setTestStart,
  ]);

  const handleFinishTest = useCallback(() => {
    setIsTestFinished(true);
    setTestEnd(Date.now());

    router.push('/test-result');
  }, [router, setIsTestFinished, setTestEnd]);

  const handleFinishStep = useCallback(() => {
    if (currentStep >= libraryOrder.length * stepsPerLibrary) {
      return;
    }

    const now = Date.now();

    addGuess({
      trueAzimuth,
      trueElevation,
      guessedAzimuth,
      guessedElevation,
      library: currentLibrary,
      guessStart: currentGuessStart,
      guessEnd: now,
    });

    setGuessStart(now);

    incrementStep();
    setRandomAngles();
    clearCurrentGuess();

    const currentStepInLibrary =
      currentStep - currentLibraryIndex * stepsPerLibrary;

    if (currentStepInLibrary >= stepsPerLibrary - 1) {
      if (currentLibraryIndex >= libraryOrder.length - 1) {
        handleFinishTest();
        return;
      }

      const newLibrary = libraryOrder[currentLibraryIndex + 1];
      setCurrentLibrary(newLibrary);
      router.push(`/library-redirect?library=${newLibrary}`);
    }
  }, [
    addGuess,
    clearCurrentGuess,
    currentGuessStart,
    currentLibrary,
    currentLibraryIndex,
    currentStep,
    guessedAzimuth,
    guessedElevation,
    handleFinishTest,
    incrementStep,
    libraryOrder,
    router,
    setCurrentLibrary,
    setGuessStart,
    setRandomAngles,
    stepsPerLibrary,
    trueAzimuth,
    trueElevation,
  ]);

  return {
    handleFinishStep,
    handleFinishTest,
    handleStartTest,
  };
};
