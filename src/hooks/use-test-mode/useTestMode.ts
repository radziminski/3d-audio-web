import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import { useSettingsStore } from '~/store/settings/useSettingsStore'; // Assuming this is the correct import path
import { useTestStore } from '~/store/settings/useTestStore';

export const SUPPORTED_LIBRARIES = [
  'web-api',
  'js-ambisonics',
  'resonance',
  'omnitone',
];

export const shuffleArray = <T>(arr: T[]) =>
  arr
    .map((value) => [Math.random(), value] as const)
    .sort(([a], [b]) => a - b)
    .map((entry) => entry[1]);

export const useTestMode = () => {
  const router = useRouter();

  // Settings Store
  const {
    setRandomAngles,
    setAppMode,
    setAngles,
    azimuth: trueAzimuth,
    elevation: trueElevation,
  } = useSettingsStore();

  // Test Store
  const {
    azimuthGuess: guessedAzimuth,
    elevationGuess: guessedElevation,
    addGuess,
    incrementCurrentStep: incrementStep,
    setCurrentLibrary,
    setIsTestFinished,
    setCurrentStep,
    setLibraryOrder,
    clearGuesses,
    clearCurrentGuess,
    setTestStart,
    setTestEnd,
    currentGuessStart,
    currentLibrary,
    currentStep,
    stepsPerLibrary,
    libraryOrder,
    experimentLibraries,
    setCurrentGuessStart: setGuessStart,
    testAngles,
    resetTestAngles,
  } = useTestStore();

  const currentLibraryIndex = libraryOrder.indexOf(currentLibrary);

  const handleStartTest = useCallback(() => {
    setAppMode('test');
    setIsTestFinished(false);
    setCurrentStep(0);

    const randomLibraryOrder = shuffleArray([...experimentLibraries]);
    setLibraryOrder(randomLibraryOrder);

    clearGuesses();
    clearCurrentGuess();
    setTestStart(Date.now());
    setGuessStart(Date.now());

    const testa = resetTestAngles();
    setAngles(testa[0].azimuth, testa[0].elevation);

    const newLibrary = randomLibraryOrder[0];
    setCurrentLibrary(newLibrary);
    router.push(`/library-redirect?library=${newLibrary}`);
  }, [
    setAppMode,
    setIsTestFinished,
    setCurrentStep,
    experimentLibraries,
    setLibraryOrder,
    clearGuesses,
    clearCurrentGuess,
    setTestStart,
    setGuessStart,
    resetTestAngles,
    setAngles,
    setCurrentLibrary,
    router,
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

    // setRandomAngles();

    let currentStepInLib = currentStep + 1;
    while (currentStepInLib > stepsPerLibrary) {
      currentStepInLib -= stepsPerLibrary;
    }

    const angles = testAngles[currentStepInLib];

    if (angles) {
      console.log(angles);
      setAngles(angles.azimuth, angles.elevation);
    }

    clearCurrentGuess();

    const currentStepInLibrary =
      currentStep - currentLibraryIndex * stepsPerLibrary;

    if (currentStepInLibrary >= stepsPerLibrary - 1) {
      if (currentLibraryIndex >= libraryOrder.length - 1) {
        handleFinishTest();
        return;
      }

      const [newAngles] = resetTestAngles();

      setAngles(newAngles.azimuth, newAngles.elevation);

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
    resetTestAngles,
    router,
    setAngles,
    setCurrentLibrary,
    setGuessStart,
    stepsPerLibrary,
    testAngles,
    trueAzimuth,
    trueElevation,
  ]);

  return {
    handleFinishStep,
    handleFinishTest,
    handleStartTest,
  };
};
