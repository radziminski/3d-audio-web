import { Select, createStyles } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

const useStyles = createStyles((theme) => ({
  label: {
    color: 'white',
  },
}));

type AudioSourceSelectProps = {
  onChange?: (value: string) => void;
};

export const AudioSourceSelect = ({ onChange }: AudioSourceSelectProps) => {
  const { classes } = useStyles();

  const setAudioSrc = useSettingsStore(({ setAudioSource }) => setAudioSource);
  const audioSource = useSettingsStore(({ audioSource }) => audioSource);

  return (
    <Select
      label='Pick audio track'
      placeholder='Choose audio sample'
      onChange={(value) => {
        setAudioSrc(value ?? '');
        onChange?.(value ?? '');
      }}
      value={audioSource}
      classNames={{
        label: classes.label,
      }}
      data={[
        { value: '/sine.ogg', label: 'Sine' },
        { value: '/bicycle-bells.mp3', label: 'Bicycle bells' },
        { value: '/pink-noise.mp3', label: 'Pink noise' },
        { value: '/guitar.mp3', label: 'Guitar' },
        { value: '/test.mp3', label: 'Full Song' },
        { value: '/female-voice.mp3', label: 'Female voice' },
        { value: '/male-voice.mp3', label: 'Male voice' },
      ]}
    />
  );
};
