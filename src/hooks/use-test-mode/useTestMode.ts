import { useCallback } from 'react';
import { useRouter } from 'next/router';
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
    setIsBypassed,
    azimuth: trueAzimuth,
    elevation: trueElevation,
    isBypassed: trueIsBypassed,
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
    resetUsedSamples,
    setLastSample,
    currentGuessStart,
    currentLibrary,
    currentStep,
    stepsPerLibrary,
    libraryOrder,
    experimentLibraries,
    setCurrentGuessStart: setGuessStart,
    testAngles,
    lastSample,
    usedSamples,
    resetTestAngles,
  } = useTestStore();

  const currentLibraryIndex = libraryOrder.indexOf(currentLibrary);

  const handleStartTest = useCallback(() => {
    setAppMode('test');
    setIsTestFinished(false);
    setCurrentStep(0);
    resetUsedSamples();

    const randomLibraryOrder = shuffleArray([...experimentLibraries]);
    setLibraryOrder(randomLibraryOrder);

    clearGuesses();
    clearCurrentGuess();
    setTestStart(Date.now());
    setGuessStart(Date.now());

    const testa = resetTestAngles();
    setAngles(testa[0].azimuth, testa[0].elevation);
    setIsBypassed(testa[0].isBypassed ?? false);

    const newLibrary = randomLibraryOrder[0];
    setCurrentLibrary(newLibrary);
    setTimeout(() => {
      router.push(`/guess`);
    }, 500);
  }, [
    setAppMode,
    setIsTestFinished,
    setCurrentStep,
    resetUsedSamples,
    experimentLibraries,
    setLibraryOrder,
    clearGuesses,
    clearCurrentGuess,
    setTestStart,
    setGuessStart,
    resetTestAngles,
    setAngles,
    setIsBypassed,
    setCurrentLibrary,
    router,
  ]);

  const handleFinishTest = useCallback(() => {
    setIsTestFinished(true);
    setTestEnd(Date.now());
    router.push('/test-result');
  }, [router, setIsTestFinished, setTestEnd]);

  const handleFinishStep = useCallback(
    (asBypassed?: boolean) => {
      if (currentStep >= libraryOrder.length * stepsPerLibrary) {
        return;
      }

      const now = Date.now();

      addGuess({
        trueAzimuth,
        trueElevation,
        guessedAzimuth,
        guessedElevation,
        guessedIsBypassed: asBypassed,
        isBypassed: trueIsBypassed,
        library: currentLibrary,
        guessStart: currentGuessStart,
        guessEnd: now,
        lastSample,
        usedSamples,
      });

      resetUsedSamples();
      setLastSample(undefined);

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
        setIsBypassed(angles.isBypassed ?? false);
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
        setIsBypassed(newAngles.isBypassed ?? false);

        const newLibrary = libraryOrder[currentLibraryIndex + 1];
        setCurrentLibrary(newLibrary);
      }
    },
    [
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
      lastSample,
      libraryOrder,
      resetTestAngles,
      resetUsedSamples,
      setAngles,
      setCurrentLibrary,
      setGuessStart,
      setIsBypassed,
      stepsPerLibrary,
      testAngles,
      trueAzimuth,
      trueElevation,
      trueIsBypassed,
      usedSamples,
    ]
  );

  return {
    handleFinishStep,
    handleFinishTest,
    handleStartTest,
  };
};
