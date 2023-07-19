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
  const currentLibrary = useTestStore((state) => state.currentLibrary);
  const currentStep = useTestStore((state) => state.currentStep);
  const stepsPerLibrary = useTestStore((state) => state.stepsPerLibrary);
  const libraryOrder = useTestStore((state) => state.libraryOrder);

  const currentLibraryIndex = libraryOrder.indexOf(currentLibrary);

  const handleStartTest = useCallback(() => {
    setIsTestFinished(false);
    setCurrentStep(0);
    const randomLibraryOrder = shuffleArray(SUPPORTED_LIBRARIES);
    setLibraryOrder(randomLibraryOrder);
    clearGuesses();
    setRandomAngles();
    clearCurrentGuess();

    const newLibrary = randomLibraryOrder[0];
    setCurrentLibrary(newLibrary);
    router.push(`/library-redirect?library=${newLibrary}`);
  }, [
    clearCurrentGuess,
    clearGuesses,
    router,
    setCurrentLibrary,
    setCurrentStep,
    setIsTestFinished,
    setLibraryOrder,
    setRandomAngles,
  ]);

  const handleFinishTest = useCallback(() => {
    setIsTestFinished(true);
    router.push('/test-result');
  }, [router, setIsTestFinished]);

  const handleFinishStep = useCallback(() => {
    if (currentStep >= libraryOrder.length * stepsPerLibrary - 1) {
      return;
    }

    addGuess({
      trueAzimuth,
      trueElevation,
      guessedAzimuth,
      guessedElevation,
      library: currentLibrary,
    });

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
