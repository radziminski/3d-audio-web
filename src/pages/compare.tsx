import { Button, createStyles } from '@mantine/core';
import { useState } from 'react';
import { Compare } from '~/components/compare/Compare';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 850,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    margin: '0 0 24px',
  },
  paragraph: {
    margin: 0,
    marginBottom: '16px',
    color: '#233',
    fontWeight: 400,
    textAlign: 'left',
    strong: {
      fontWeight: 600,
    },
    div: {
      margin: '10px 14px',
      fontWeight: 400,
      span: {
        fontWeight: 600,
      },
    },
  },
  buttons: {
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    margin: '32px 0 0',
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
}));

export default function ComparePage() {
  const { classes } = useStyles();

  const isClientRender = useClientRender();

  if (!isClientRender)
    return (
      <>
        <Providers>
          <Layout></Layout>
        </Providers>
      </>
    );

  return (
    <Providers>
      <Layout withScroll>
        <div className={classes.container}>
          <h1 className={classes.title}>
            Explore and Rate the 3D Sound Technologies
          </h1>
          <p className={classes.paragraph}>
            Welcome to the first interactive part of this test! Here, you have
            the unique opportunity to switch between{' '}
            <strong>various 3D sound technologies.</strong>
          </p>
          <p className={classes.paragraph}>
            By clicking on one of the blue buttons below, you can select a given
            technology that will be used to make the sound seem like it iss
            coming from a given direction around you. After experimenting with
            it, please rate your experience on two aspects:{' '}
            <strong>overall sound quality</strong> and the{' '}
            <strong>degree of 3D realism</strong>. Your ratings, on a scale from
            0 to 10, will help us understand your experiences with each
            technology.
            <br />
            <i>
              Note: Value <strong>-1</strong> on the slider means that a given
              aspects has not been rated yet. Please choose score of both
              aspects for all 4 technologies to continue.
            </i>
          </p>
          <p className={classes.paragraph}>
            Using two knobs below, you can adjust the{' '}
            <strong>horizontal (azimuth knob)</strong>
            and <strong>vertical (elevation slider) </strong> direction of the
            sound. You can pick different sounds from the list next to the
            sliders. Use the audio controls to play, pause, or skip through the
            chosen track. The gain (volume) slider allows you to adjust how loud
            the sound is.,
          </p>
        </div>
        <Compare />
      </Layout>
    </Providers>
  );
}
