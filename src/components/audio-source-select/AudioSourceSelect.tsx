import { Select, createStyles } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

const useStyles = createStyles((theme) => ({
  label: {
    color: 'white',
  },
}));

export const AudioSourceSelect = () => {
  const { classes } = useStyles();

  const setAudioSrc = useSettingsStore(({ setAudioSource }) => setAudioSource);
  const audioSource = useSettingsStore(({ audioSource }) => audioSource);

  return (
    <Select
      label='Pick audio source'
      placeholder='Choose audio sample'
      onChange={setAudioSrc}
      value={audioSource}
      classNames={{
        label: classes.label,
      }}
      data={[
        { value: '/sine.ogg', label: 'Sine' },
        { value: '/guitar.mp3', label: 'Guitar' },
        { value: '/test.mp3', label: 'Full Song' },
        { value: '/female-voice.mp3', label: 'Female voice' },
        { value: '/male-voice.mp3', label: 'Male voice' },
      ]}
    />
  );
};
