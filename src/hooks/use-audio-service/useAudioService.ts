import { useEffect } from 'react';
import { AudioService } from '~/services/audio';
import { useSettingsStore } from '../../store/settings/useSettingsStore';

export const useAudioService = () => {
  const { panning, gain, sourcePosition } = useSettingsStore();

  useEffect(() => {
    const audioService = AudioService.getInstance();

    audioService?.setSourcePosition(sourcePosition);
  }, [sourcePosition]);

  useEffect(() => {
    const audioService = AudioService.getInstance();

    audioService?.setOutputGain(gain / 100);
  }, [gain]);
};
