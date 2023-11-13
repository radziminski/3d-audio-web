import { Button, MultiSelect, NumberInput, createStyles } from '@mantine/core';
import { Providers } from '~/components/providers/Providers';
import { useEffect } from 'react';
import { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { useTestStore } from '~/store/settings/useTestStore';
import { useTestMode } from '~/hooks/use-test-mode/useTestMode';
import { Layout } from '~/components/layout/Layout';

const useStyles = createStyles((theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    maxWidth: 400,
    width: '100%',
    gap: '16px',
    padding: '64px 32px',
  },
  input: {
    width: '100%',
    alignSelf: 'stretch',
  },
  label: {
    color: 'white',
  },
  title: {
    marginBottom: 0,
  },
  select: {
    paddingTop: '8px',
    paddingBottom: '8px',
    marginBottom: '24px',
  },
  back: {
    position: 'fixed',
    top: '24px',
    left: '24px',
    fontFamily: 'var(--font-poppins)',
    color: 'white',
    zIndex: 999,
    fontWeight: 500,
    fontSize: 16,
    display: 'block',
    textDecoration: 'underline',
    cursor: 'pointer',
    textUnderlineOffset: '3px',
    transition: 'opacity 150ms ease-in-out',
    opacity: 0.7,
    '&:hover': {
      opacity: 1,
    },
  },
}));

const librariesSelect: { value: SupportedLibrary; label: string }[] = [
  { value: 'web-api', label: 'Web Audio API' },
  { value: 'resonance', label: 'Resonance Audio' },
  { value: 'omnitone', label: 'Omnitone' },
  { value: 'js-ambisonics', label: 'JS Ambisonics' },
];

export default function TestPage() {
  const { classes } = useStyles();

  const { handleStartTest } = useTestMode();

  const reset = useTestStore((state) => state.reset);
  const stepsPerLibrary = useTestStore((state) => state.stepsPerLibrary);
  const setStepsPerLibrary = useTestStore((state) => state.setStepsPerLibrary);
  const experimentLibraries = useTestStore(
    (state) => state.experimentLibraries
  );
  const setExperimentLibraries = useTestStore(
    (state) => state.setExperimentLibraries
  );

  useEffect(() => {
    reset();
  }, [reset]);

  return (
    <Providers>
      <Layout>
        <div className={classes.content}>
          <h2 className={classes.title}>Test setup</h2>
          <NumberInput
            label='Guesses per library'
            classNames={{
              label: classes.label,
              root: classes.input,
            }}
            value={stepsPerLibrary}
            onChange={setStepsPerLibrary}
          />
          <MultiSelect
            data={librariesSelect}
            classNames={{
              label: classes.label,
              root: classes.input,
              input: classes.select,
            }}
            label='3D Audio libraries to be tested'
            placeholder="Pick all that you'd like to test"
            onChange={(libraries) =>
              setExperimentLibraries([...(libraries as SupportedLibrary[])])
            }
            value={[...experimentLibraries]}
          />
          <Button onClick={handleStartTest}>Start test!</Button>
        </div>
      </Layout>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a className={classes.back} href='/'>
        &larr; Go back to mode choice
      </a>
    </Providers>
  );
}
