import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { Layout } from '~/components/layout/Layout';
import { Button, createStyles } from '@mantine/core';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';
import { nanoid } from 'nanoid';
import { useTestStore } from '~/store/settings/useTestStore';
import { useEffect } from 'react';

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  title: {
    margin: '0 0 24px',
  },
  paragraph: {
    margin: '0 0 24px',
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

export default function About() {
  const router = useRouter();
  const isClientRender = useClientRender();

  const { classes } = useStyles();

  const { setProgress } = useTestStore();

  useEffect(() => {
    setProgress(20);
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
          <h1 className={classes.title}>Firstly: What is 3D Sound?</h1>
          <p className={classes.paragraph}>
            Unlike the conventional stereo sound, which is what we&apos;re used
            to when listening to music, 3D sound offers a completely different
            experience. In stereo sound, you perceive the audio as if it&apos;s
            playing <strong>inside your head</strong>, sometimes leaning towards
            your left or right ear.
          </p>
          <p className={classes.paragraph}>
            3D sound, however, creates an illusion that the sound is coming from
            all around you, <strong>outside of your head</strong>. This
            immersive experience makes you feel like you&apos;re at the center
            of a soundscape, with audio elements surrounding you from various
            directions.
          </p>

          <p className={classes.paragraph}>
            As an introduction to the concept of 3D sound, I highly recommend
            watching the video below. It presents the differences between casual
            stereo sound and 3D sound experiences. This demonstration should
            give you a real sense of what 3D sound is all about ⬇️
          </p>

          <iframe
            width='560'
            height='315'
            src='https://www.youtube.com/embed/uIpVM4-3tV4?si=gY51T0aNgF322dXM&amp;start=25'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            referrerPolicy='strict-origin-when-cross-origin'
            allowFullScreen
            style={{ marginBottom: '24px', margin: '0 auto 24px' }}
          ></iframe>

          <p className={classes.paragraph}>
            To truly understand the difference, I also recommend watching the
            first minute of a short video below. It&apos;s an example of
            360-degree 3D sound experience, where you can notice how different
            sounds seem to move around you, coming from different directions ⬇️
          </p>

          <iframe
            style={{ marginBottom: '24px', margin: '0 auto 24px' }}
            width='560'
            height='315'
            // src='https://www.youtube.com/embed/wkya01ZKboU?si=FqTm89qEgmjyGI01&amp;start=23'
            src='https://www.youtube.com/embed/OLizj5FYkq4?si=Vr23Y5cz1OJIsb87'
            title='YouTube video player'
            frameBorder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            allowFullScreen
          ></iframe>

          <Button
            size='md'
            onClick={() => {
              router.push('/compare');
            }}
          >
            Continue
          </Button>
        </div>
      </Layout>
    </Providers>
  );
}
