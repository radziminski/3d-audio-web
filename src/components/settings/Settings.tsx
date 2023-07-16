import { PropsWithChildren, RefObject } from 'react';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { SceneSettings } from '../scene-settings/SceneSettings';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

type SettingsProps = {
  isInsideView?: boolean;
  audioRef?: RefObject<HTMLAudioElement>;
};

export const Settings = ({ isInsideView, audioRef }: SettingsProps) => {
  return (
    <>
      <AudioSettings audioRef={audioRef} isInsideView={isInsideView} />
      <SceneSettings isInsideView={isInsideView} />
    </>
  );
};
