import { PropsWithChildren, RefObject } from 'react';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { SceneSettings } from '../scene-settings/SceneSettings';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { AudioSource } from '../audio-source-select/AudioSourceSelect';

type SettingsProps = {
  isInsideView?: boolean;
  audioRef?: RefObject<HTMLAudioElement>;
  machPlay?: () => void;
  machPause?: () => void;
  isMach?: boolean;
  audioSources?: AudioSource[];
};

export const Settings = ({
  isInsideView,
  audioRef,
  audioSources,
  ...machProps
}: SettingsProps) => {
  return (
    <>
      <AudioSettings
        audioRef={audioRef}
        isInsideView={isInsideView}
        audioSources={audioSources}
        {...machProps}
      />
      <SceneSettings isInsideView={isInsideView} />
    </>
  );
};
