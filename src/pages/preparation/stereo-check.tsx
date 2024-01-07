import { Button, createStyles } from '@mantine/core';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Layout } from '~/components/layout/Layout';
import { Providers } from '~/components/providers/Providers';
import { StereoCheck } from '~/components/stereo-check/StereoCheck';

const useStyles = createStyles(() => ({
  wrapper: {
    maxWidth: 800,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    color: '#233',
    fontWeight: 700,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  paragraph: {
    color: '#233',
    margin: 0,
    fontWeight: 400,
    textAlign: 'left',
    strong: {
      fontWeight: 600,
    },
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    height: 180,
    paddingBottom: 80,
    width: '100%',
  },
  icon: {
    width: 34,
    height: 34,
    marginBottom: 4,
  },
}));

export default function StereoCheckPage() {
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [isStarted, setIsStarted] = useState(false);
  const { classes } = useStyles();

  const router = useRouter();

  if (isError) {
    return (
      <Providers>
        <Layout>
          <div className={classes.wrapper}>
            <h1 className={classes.header}>
              🤔 It seems that something is not right.
            </h1>
            <p className={classes.paragraph}>
              Please ensure that your headphones are connected and fitted
              correctly: the right earpiece should be in/on your right ear and
              the left earpiece in/on your left ear.
            </p>
          </div>
          <Button
            onClick={() => {
              setIsError(false);
            }}
            size='lg'
          >
            Start again
          </Button>
        </Layout>
      </Providers>
    );
  }

  if (isSuccess) {
    return (
      <Providers>
        <Layout withScroll>
          <div className={classes.wrapper}>
            <h1 className={classes.header}>
              🎉 Your headphones are set up correctly!
            </h1>
            <div />
            <div />
            <Button
              onClick={() => {
                router.push('/compare');
              }}
              size='lg'
            >
              Proceed to the next step
            </Button>
          </div>
        </Layout>
      </Providers>
    );
  }

  return (
    <Providers>
      <Layout withScroll>
        <div className={classes.wrapper}>
          <h1 className={classes.header}>
            <div className={classes.icon}>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                <path d='M4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z'></path>
              </svg>
            </div>
            First: Headphones check
          </h1>
          <p className={classes.paragraph}>
            Before starting the tests, lets check your{' '}
            <strong>headphones setup</strong>.
            <br />
            To start, <strong>put your headphones on </strong>and make sure that
            you have <strong>right</strong>. and <strong>left</strong> headphone
            in/on the correct ear.
          </p>

          <p className={classes.paragraph}>
            By hitting <strong>&quot;play&quot;</strong> on the underneath
            audio, you will hear a guitar playing in only one ear. Please select
            the &quot;LEFT&quot; or &quot;RIGHT&quot; button, depending on which
            ear you hear the guitar playing. After each guess, the guitar might
            (but does not have to) play in the other ear.
          </p>
          {!isStarted ? (
            <div className={classes.buttonWrapper}>
              <Button size='md' onClick={() => setIsStarted(true)}>
                Start
              </Button>
            </div>
          ) : (
            <StereoCheck
              onError={() => setIsError(true)}
              onSuccess={() => setIsSuccess(true)}
            />
          )}
        </div>
      </Layout>
    </Providers>
  );
}
