import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Layout } from '~/components/layout/Layout';
import { Button, createStyles } from '@mantine/core';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';

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

  useEffect(() => {
    resetStore();
  }, [resetStore]);

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
            interactive way to explore how 3D sound works in web applications.
            It will help me evaluate different 3D Sound technologies for my
            masters thesis. Think of it as an audio adventure where you get to
            experience sound in a completely new way.
          </p>
          <p className={classes.paragraph}>
            <strong>Before you begin:</strong>
            <div>
              <span>1. Headphones Needed:</span> To dive into this immersive
              experience, you&apos;ll need to wear headphones. It&apos;s
              essential for the 3D effect to work!
            </div>
            <div>
              <span>2. Wear Them Right:</span> Please make sure your headphones
              are on correctly - right earpiece on your right ear, left on your
              left. It makes a big difference!
            </div>
          </p>
          <p className={classes.paragraph}>
            <strong>What to expect:</strong>
            <div>
              <span>1. Duration</span> The test will take about 15-20 minutes of
              your time.
            </div>
            <div>
              <span>2. Choose sounds:</span> You&apos;ll get to pick from
              various audio tracks, each offering a unique 3D sound experience.
            </div>
            <div>
              <span>3. Discover Sound Directions:</span>{' '}
              <u>
                Your task is simply to identify where the sound seems to be
                coming from. Is it above, below, behind, or maybe right in front
                of you?
              </u>
            </div>
          </p>
          <Button size='md' onClick={() => router.push('/preparation')}>
            Let&apos;s begin!
          </Button>
        </div>
      </Layout>
    </Providers>
  );
}
