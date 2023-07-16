import { useCallback } from 'react';
import { setWindowDirections } from '~/store/audio/setWindowDirections';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const useTestStep = () => {
  const setRandomAngles = useSettingsStore((state) => state.setRandomAngles);

  const azimuth = useSettingsStore((state) => state.azimuth);
  const elevation = useSettingsStore((state) => state.elevation);

  const handleStartStep = useCallback(() => {
    setRandomAngles();
  }, [setRandomAngles]);

  const handleFinishStep = useCallback(() => {
    const {} = setWindowDirections;
  }, []);

  return { handleStartStep, handleFinishStep };
};
