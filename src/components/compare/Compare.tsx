import { useCallback, useEffect, useState } from 'react';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useCompareAudioService } from '~/services/audio/hooks/use-compare-audio-service/useCompareAudioService';
import { AudioSettings } from '../audio-settings/AudioSettings';
import { useSettingsStore, useTestId } from '~/store/settings/useSettingsStore';
import { Button, Tooltip, createStyles } from '@mantine/core';
import { Slider } from '../slider/Slider';
import {
  LibraryQuality,
  useQualityStore,
} from '~/store/settings/useQualityStore';
import { useRouter } from 'next/router';
import type { NewQualityGuess, QualityGuess } from '../../../db/schema';
import { VERSION_SHA } from '~/constants';
import { useUserId } from '~/hooks/use-user-id/useUserId';
import { useOs } from '@mantine/hooks';
import { useTestStore } from '~/store/settings/useTestStore';
import { useTestMode } from '~/hooks/use-test-mode/useTestMode';

async function submitGuesses(
  guesses: (LibraryQuality & { library: SupportedLibrary })[],
  userId: string,
  testId: string,
  os: string
): Promise<void> {
  const apiUrl = '/api/submit-quality-guesses';

  const guessesDto: NewQualityGuess[] = guesses.map((guess) => ({
    ...guess,
    soundQuality: guess.soundQuality ?? 0,
    soundSpatialQuality: guess.soundSpatialQuality ?? 0,
    userId,
    testId,
    versionSha: VERSION_SHA ?? 'unknown',
    os,
  }));

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(guessesDto),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  console.log('Guesses submitted successfully!');
}

const useStyles = createStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '36px',
    maxWidth: 850,
    color: '#223',
  },
  buttons: {
    display: 'flex',
    gap: '24px',
  },
  sliders: {
    width: '100%',
  },
  slider: {
    flexGrow: 1,
  },
  sliderContainer: {
    display: 'flex',
    gap: '16px',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '36px',
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: 500,
    margin: 0,
    paddingTop: '12px',
    width: '150px',
  },
  sliderTitle: {
    margin: 0,
  },
  paragraph: {
    marginBottom: '24px',
    marginTop: '8px',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  continue: {
    position: 'fixed',
    bottom: '64px',
    right: '64px',
    zIndex: 1,
  },
}));

export const Compare = () => {
  useTestMode();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { classes } = useStyles();
  const router = useRouter();
  const setAzimuth = useSettingsStore((state) => state.setAzimuth);
  const setElevation = useSettingsStore((state) => state.setElevation);
  const setAppMode = useSettingsStore((state) => state.setAppMode);

  const libraryQuality = useQualityStore((state) => state.libraryQuality);
  const setLibraryQuality = useQualityStore((state) => state.setLibraryQuality);

  const [selectedLibrary, setSelectedLibrary] = useState<SupportedLibrary>();
  const { audioRef } = useCompareAudioService(selectedLibrary);

  const userId = useUserId();
  const testId = useTestId();
  const os = useOs();

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const quesses = Object.entries(libraryQuality).map(
        ([library, quality]) =>
          ({
            ...quality,
            library: library as SupportedLibrary,
          } as const)
      );

      await submitGuesses(
        quesses,
        userId || 'unknown',
        testId ?? 'unknown',
        os
      );

      window.location.assign('/preparation/tutorial');
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [libraryQuality, os, testId, userId]);

  useEffect(() => {
    setAppMode('playground');
    setElevation(0);
    setAzimuth(0);
  }, [setAppMode, setAzimuth, setElevation]);

  let currentQualityValue = selectedLibrary
    ? libraryQuality[selectedLibrary].soundQuality ?? -1
    : -1;

  let currentSpatialQualityValue = selectedLibrary
    ? libraryQuality[selectedLibrary].soundSpatialQuality ?? -1
    : -1;

  const visibleLibrary = selectedLibrary ?? 'web-api';

  const canContinue = Object.values(libraryQuality).every(
    (quality) =>
      quality.soundQuality !== undefined &&
      quality.soundSpatialQuality !== undefined
  );

  return (
    <div className={classes.container}>
      <AudioSettings audioRef={audioRef} disableFixedPosition />
      <div className={classes.buttons}>
        {(
          [
            { label: 'Original Sound', value: undefined },
            { label: 'Technology 1', value: 'web-api' },
            { label: 'Technology 2', value: 'js-ambisonics' },
            { label: 'Technology 3', value: 'resonance' },
            { label: 'Technology 4', value: 'omnitone' },
          ] as const
        ).map(({ label, value }) => (
          <Button
            key={value}
            onClick={() => setSelectedLibrary(value)}
            color={selectedLibrary === value ? 'red' : undefined}
          >
            {label}
          </Button>
        ))}
      </div>
      <div
        className={`${classes.sliders} ${
          selectedLibrary ? '' : classes.disabled
        }`}
      >
        <div>
          <h3 className={classes.sliderTitle}>Overall Sound Quality</h3>
          <p className={classes.paragraph}>
            This slider lets you rate how pleasant the sound is when played by
            the current library.
          </p>
          <div className={classes.sliderContainer}>
            <h4 className={classes.sliderLabel}>Sounds Terrible</h4>
            <div className={classes.slider}>
              <Slider
                defaultValue={-1}
                key={`${visibleLibrary}-quality-slider`}
                value={currentQualityValue}
                onChange={(value) => {
                  setLibraryQuality(visibleLibrary, {
                    soundQuality: value,
                  });
                }}
                min={currentQualityValue >= 0 ? 0 : -1}
                max={10}
                step={1}
                label={''}
                labelAlwaysOn
              />
            </div>
            <h4 className={classes.sliderLabel}>Sounds Amazing</h4>
          </div>
        </div>
        <div>
          <h3 className={classes.sliderTitle}>3D Realism</h3>
          <p className={classes.paragraph}>
            Here you can evaluate how realistic and spatial the sound feels.
          </p>
          <div className={classes.sliderContainer}>
            <h4 className={classes.sliderLabel}>
              Sounds completely inside the head
            </h4>
            <div className={classes.slider}>
              <Slider
                defaultValue={-1}
                key={`${visibleLibrary}-spatial-slider`}
                value={currentSpatialQualityValue}
                onChange={(value) => {
                  setLibraryQuality(visibleLibrary, {
                    soundSpatialQuality: value,
                  });
                }}
                min={currentSpatialQualityValue >= 0 ? 0 : -1}
                max={10}
                step={1}
                label={''}
                labelAlwaysOn
              />
            </div>
            <h4 className={classes.sliderLabel}>
              Sounds completely outside of the head
            </h4>
          </div>
        </div>
      </div>
      <div className={classes.continue}>
        {canContinue ? (
          <Button size='lg' onClick={onSubmit}>
            {isLoading ? 'Loading...' : <>Continue &rarr;</>}
          </Button>
        ) : (
          <Tooltip label='Please rate both aspects (from 0 to 10) for all technologies to continue'>
            <Button style={{ cursor: 'not-allowed', opacity: 0.65 }} size='lg'>
              Continue &rarr;
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
