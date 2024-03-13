import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSettingsStore } from '~/store/settings/useSettingsStore'; // Assuming this is the correct import path
import { useTestStore } from '~/store/settings/useTestStore';
import { roundToNearest } from '~/helpers/math/roundToNearest';

export const SUPPORTED_LIBRARIES = [
  'web-api',
  'js-ambisonics',
  'resonance',
  'omnitone',
  'mach1',
];

export const useTestMode = () => {
  const router = useRouter();

  const setAudioSrc = useSettingsStore(({ setAudioSource }) => setAudioSource);

  // Settings Store
  const {
    setAppMode,
    setAngles,
    azimuth: trueAzimuth,
    elevation: trueElevation,
    sceneType,
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
    currentAngle,
    libraryOrder,
    experimentLibraries,
    setCurrentGuessStart: setGuessStart,
    testAngles,
    lastSample,
    usedSamples,
    guessType,
    setGuessType,
    resetTestAngles,
    setCurrentGuess,
    setCurrentAngle,
  } = useTestStore();

  const currentLibraryIndex = libraryOrder.indexOf(currentLibrary);

  const handleStartTest = useCallback(() => {
    setAudioSrc('/guitar.mp3');
    setAppMode('test');
    setIsTestFinished(false);
    setCurrentStep(0);
    resetUsedSamples();

    // const randomLibraryOrder = shuffleArray([...experimentLibraries]);
    const randomLibraryOrder = [...experimentLibraries];
    setLibraryOrder(randomLibraryOrder);

    clearGuesses();
    clearCurrentGuess();
    setTestStart(Date.now());
    setGuessStart(Date.now());

    const testa = resetTestAngles();
    setAngles(testa[0].azimuth, testa[0].elevation);
    setGuessType(testa[0].guessType ?? 'normal');
    setCurrentAngle(testa[0]);

    const newLibrary = randomLibraryOrder[0];
    setCurrentLibrary(newLibrary);
    setTimeout(() => {
      router.push(`/guess`);
    }, 500);
  }, [
    setAudioSrc,
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
    setGuessType,
    setCurrentAngle,
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

      const parsedGuess = roundToNearest(guessedAzimuth, guessedElevation);

      addGuess({
        trueAzimuth,
        trueElevation,
        guessedAzimuth: parsedGuess.azimuth,
        guessedElevation: parsedGuess.elevation,
        library: currentLibrary,
        guessStart: currentGuessStart,
        guessEnd: now,
        sample: currentAngle?.sample,
        type: guessType || 'normal',
        view: sceneType,
      });

      resetUsedSamples();
      setLastSample(undefined);

      setGuessStart(now);

      incrementStep();

      let currentStepInLib = currentStep + 1;
      while (currentStepInLib > stepsPerLibrary) {
        currentStepInLib -= stepsPerLibrary;
      }

      const angles = testAngles[currentStepInLib];

      if (angles) {
        setAngles(angles.azimuth, angles.elevation);
        setGuessType(angles.guessType ?? 'normal');
        setCurrentAngle(angles);
        console.log('setting angles', angles);
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
        setGuessType(newAngles.guessType ?? 'normal');

        const newLibrary = libraryOrder[currentLibraryIndex + 1];
        setCurrentLibrary(newLibrary);
      }
    },
    [
      sceneType,
      addGuess,
      clearCurrentGuess,
      currentGuessStart,
      currentLibrary,
      currentLibraryIndex,
      currentStep,
      guessType,
      guessedAzimuth,
      guessedElevation,
      handleFinishTest,
      incrementStep,
      libraryOrder,
      resetTestAngles,
      resetUsedSamples,
      setAngles,
      setCurrentAngle,
      setCurrentLibrary,
      setGuessStart,
      setGuessType,
      setLastSample,
      stepsPerLibrary,
      testAngles,
      trueAzimuth,
      trueElevation,
      currentAngle,
    ]
  );

  return {
    handleFinishStep,
    handleFinishTest,
    handleStartTest,
  };
};
