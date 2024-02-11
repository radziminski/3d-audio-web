import { PropsWithChildren, RefObject } from 'react';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { SceneSettings } from '../scene-settings/SceneSettings';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

type SettingsProps = {
  isInsideView?: boolean;
  audioRef?: RefObject<HTMLAudioElement>;
  machPlay?: () => void;
  machPause?: () => void;
  isMach?: boolean;
};

export const Settings = ({
  isInsideView,
  audioRef,
  ...machProps
}: SettingsProps) => {
  return (
    <>
      <AudioSettings
        audioRef={audioRef}
        isInsideView={isInsideView}
        {...machProps}
      />
      <SceneSettings isInsideView={isInsideView} />
    </>
  );
};
