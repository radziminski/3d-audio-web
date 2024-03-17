import { Select, createStyles } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

const useStyles = createStyles((theme) => ({
  label: {
    color: 'white',
  },
}));

const ALL_AUDIO_SOURCES = [
  { value: '/sine.ogg', label: 'Sine' },
  { value: '/guitarx.mp3', label: 'Guitar' },
  { value: '/pink-noise.mp3', label: 'Pink noise' },
  { value: '/bicycle-bells.mp3', label: 'Bicycle bells' },
  { value: '/bees.mp3', label: 'Bees and other insects' },
  { value: '/wood-breaking.mp3', label: 'Wood & branches breaking' },
  { value: '/test.mp3', label: 'Full Song' },
  { value: '/female-voice.mp3', label: 'Female voice' },
  { value: '/male-voice.mp3', label: 'Male voice' },
] as const;

export type AudioSource = (typeof ALL_AUDIO_SOURCES)[number]['label'];

type AudioSourceSelectProps = {
  onChange?: (value: string) => void;
  sources?: AudioSource[];
};

export const AudioSourceSelect = ({
  onChange,
  sources,
}: AudioSourceSelectProps) => {
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
      data={ALL_AUDIO_SOURCES.filter(
        (source) => sources?.includes(source.label) ?? true
      )}
    />
  );
};
