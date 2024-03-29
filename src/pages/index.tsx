import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  useSettingsStore,
  useTestIdStore,
} from '~/store/settings/useSettingsStore';
import { Layout } from '~/components/layout/Layout';
import { Button, createStyles } from '@mantine/core';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';
import { nanoid } from 'nanoid';
import { useQualityStore } from '~/store/settings/useQualityStore';
import { useTestStore } from '~/store/settings/useTestStore';

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  title: {
    margin: '0 0 32px',
  },
  paragraph: {
    margin: '0 0 32px',
    color: '#233',
    fontWeight: 400,
    textAlign: 'left',
    strong: {
      fontWeight: 700,
    },
    div: {
      margin: '12px 16px',
      fontWeight: 400,
      span: {
        fontWeight: 600,
      },
    },
  },
}));

export default function Home() {
  const router = useRouter();
  const resetStore = useSettingsStore((state) => state.reset);
  const isClientRender = useClientRender();

  const { classes } = useStyles();

  const { setTestId } = useTestIdStore();

  const resetQuality = useQualityStore((state) => state.reset);
  const resetTest = useTestStore((state) => state.reset);

  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    resetQuality();
    resetStore();
    resetTest();
    router.prefetch('/preparation/stereo-check');
    router.prefetch('/preparation/tutorial');
    router.prefetch('/compare');
  }, [resetStore, router, resetQuality, resetTest]);

  const { setProgress } = useTestStore();

  useEffect(() => {
    setProgress(10);
  }, [setProgress]);

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
            Welcome to the 3D Sound Experience! 👋🏻
          </h1>
          <p className={classes.paragraph}>
            <strong>Hello!</strong> I&apos;m thrilled to welcome you to a unique
            journey into the world of <strong>3D sound</strong>. If you&apos;ve
            ever wondered how sound can feel like it&apos;s coming from all
            around you, while wearing headphones, you&apos;re in the right
            place!
          </p>
          <p className={classes.paragraph}>
            <strong>What&apos;s this all about?</strong> This test is a fun and
            interactive way to explore how 3D audio works in web applications.
            It will help me evaluate different 3D Sound technologies for my
            masters thesis.
          </p>
          <p className={classes.paragraph}>
            <strong>Before you begin:</strong>
            <div>
              <span>1. Headphones needed:</span> To dive into this immersive
              experience, you&apos;ll need to wear headphones. It&apos;s
              essential for the 3D effect to work!
            </div>
            <div>
              <span>2. Wear them right:</span> Please make sure your headphones
              are on correctly - right earpiece on your right ear, left on your
              left. It makes a big difference!
            </div>
          </p>
          <p className={classes.paragraph}>
            <strong>What to expect:</strong>
            <div>
              <span>1. Duration</span> The test will take around 20-25 minutes
              of your time.
            </div>
            <div>
              <span>2. Evaluate sound quality:</span> Firstly, you will be asked
              to play around with each selected technology and evaluate its
              quality and spatial effectiveness.
            </div>
            <div>
              <span>3. Discover sound directions:</span>{' '}
              <u>
                Later, your task will be to identify where the sound seems to be
                coming from. Is it above, below, behind, or maybe right in front
                of you?
              </u>
            </div>
            <div>
              <span>4. The whole test is fully anonymous.</span>{' '}
            </div>
          </p>
          <Button
            size='md'
            onClick={() => {
              if (isRedirecting) return;

              setTestId(nanoid());
              router.push('/preparation');
              setIsRedirecting(true);
            }}
            loading={isRedirecting}
          >
            Let&apos;s begin!
          </Button>
        </div>
      </Layout>
    </Providers>
  );
}
