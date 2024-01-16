import { Providers } from '~/components/providers/Providers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Layout } from '~/components/layout/Layout';
import { Button, createStyles } from '@mantine/core';
import { useClientRender } from '~/hooks/use-client-render/useClientRender';
import Image from 'next/image';
import { useTestMode } from '~/hooks/use-test-mode/useTestMode';
import { useTestStore } from '~/store/settings/useTestStore';

const TUTORIAL_STEPS = [
  {
    title: '1: Describing sound direction',
    paragraphs: [
      {
        title: 'How to describe direction of the sound you hear?',
        points: [
          `The direction of the sound that you hear can be simply described with two angles: <strong>azimuth</strong> and <strong>elevation</strong>.`,
          `<strong>Azimuth:</strong> Imagine a flat circle around you. The sound can come from any point on this circle - such point is described by azimuth angle. If it's right in front of you, that's 0 degrees. Directly to the right is 90 degrees, behind you is 180 degrees, and to the left is 270 degrees.`,
          `<strong>Elevation:</strong> Now, think of a vertical line that runs from the top of your head to the ground. A given point on it is described by elevation angle. Sounds can come from above (90 degrees), the same level as your ears (0 degrees), or below you (-90 degrees).`,
          `The distance of the sound will be ignored in this test.`,
        ],
      },
    ],
    image: '/direction.jpeg',
  } as const,
  {
    title: '2: The Scene and Your Avatar',
    paragraphs: [
      {
        title: 'Your virtual sound space:',
        points: [
          `In the center of the screen, you'll see a figure sitting down. This is your avatar in the sound space.`,
          `An arrow surrounds your avatar - it's supposed to point into the <strong>direction</strong> of the sound you're hearing.`,
          `You can rotate and zoom the scene with your mouse (just drag the screen) to get a better view.`,
        ],
      },
      {
        title: 'Your Task:',
        points: [
          `For each sound, adjust the arrow to point to the direction where you believe the sound is coming from.`,
          `To simplify things, you'll be asked to <strong>guess only the azimuth (horizontal angle)</strong> or <strong>elevation (vertical angle)</strong> of the sound - never both.`,
          `After you make a guess, the direction changes, and you should point the arrow again for the new sound.`,
        ],
      },
    ],
    image: '/step1.gif',
  } as const,
  {
    title: '3: Controlling the arrow',
    paragraphs: [
      {
        title: 'Adjusting the sound direction:',
        points: [
          `Use the round slider in the bottom right to change the arrow's azimuth (the horizontal direction of the sound).`,
          `The vertical slider next to it adjusts the elevation (the vertical direction).`,
          `In the first step you've used the azimuth and elevation sliders to change sound direction.  Now, <strong>you should use it, to point the arrow in the direction you think the sound is coming from.</strong>`,
          `In each step <strong>one of the sliders will be disabled</strong> (you won't be able to change it). If the vertical slider is disabled, you should only guess the azimuth of the sound (the horizontal direction) and vice-versa.`,
        ],
      },
      {
        title: 'Choosing and controlling sound:',
        points: [
          `Pick different sounds from the list next to the sliders.`,
          `Use the audio controls to play, pause, or skip through the chosen track.`,
          `The gain (volume) slider allows you to adjust how loud the sound is.`,
        ],
      },
    ],
    image: '/step2.gif',
  } as const,
  {
    title: '4: Current step information',
    paragraphs: [
      {
        title: 'Tracking your progress:',
        points: [
          `The top left corner of the screen keeps you informed about:`,
          `Your current step in the test.`,
          `The number of steps for each sound technology.`,
          `The sound technology you're currently testing (shown blurred).`,
          `Your last guessed azimuth and elevation.`,
        ],
      },
    ],
    image: '/dashboard-info.png',
  } as const,
  {
    title: '5: Making your guess',
    paragraphs: [
      {
        title: 'Ready to commit?',
        points: [
          `Once you've positioned the arrow, click "Make a guess!" at the bottom center.`,
          `This saves your response and takes you to the next step (new sound direction).`,
        ],
      },
    ],
    image: '/step4.gif',
  } as const,
  {
    title: "6: It's a trap!",
    paragraphs: [
      {
        title: 'Be ready for traps!',
        points: [
          `As you navigate through the sounds in the application, it's important to be aware that occasionally, <strong>you may hear a sound that has not been processed by any 3D sound library</strong>. It will sound like any other sound you would hear on your headphones outside of this test. This is a deliberate "trap" where the sound does not originate from any particular direction in space and is not modified to create a 3D audio effect.`,
          `🚨 When you come across such a sound, it's crucial <u><b>not</b> to click the "Make a Guess!" button</u>. Instead,  <strong>click "Mark as not 3D sound (trap)" </strong> button right underneath it. `,
          `Moreover, sometimes the sound will play in only one headphone. When that happens, simply choose the azimuth of 90 degrees for right-only sounds, and 270 degrees for left-only sounds.`,
        ],
      },
    ],
    image: '/step5.gif',
  } as const,
  {
    title: '7: Changing to first-person view',
    paragraphs: [
      {
        title: 'See through different eyes:',
        points: [
          `The button in the bottom left lets you switch from third-person view to first-person view`,
          `In first person view, you become the avatar, with the scene rotating as you move the mouse to guess the sound's direction.`,
          `In the first-person view, you rotate the scene itself to where you feel the sound is coming from. Choose whichever view helps you guess better!`,
        ],
      },
    ],
    image: '/step7.gif',
  } as const,
];

const useStyles = createStyles(() => ({
  container: {
    maxWidth: 850,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
  },
  title: {
    margin: '0 0 24px',
  },
  paragraph: {
    margin: 0,
    color: '#233',
    fontWeight: 400,
    textAlign: 'left',
    strong: {
      fontWeight: 600,
    },
    b: {
      fontWeight: 800,
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
    '@media (max-width: 700px)': {
      gap: '16px',
    },
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
}));

export default function TutorialPage() {
  const [tutorialStep, setTutorialStep] = useState(-1);

  const { handleStartTest } = useTestMode();
  const resetStore = useSettingsStore((state) => state.reset);
  const isClientRender = useClientRender();
  const { reset } = useTestStore();
  const { setAppMode } = useSettingsStore((state) => state);

  const { classes } = useStyles();

  useEffect(() => {
    resetStore();
    reset();
    setAppMode('test');
  }, [resetStore, reset, setAppMode]);

  const currentStep = TUTORIAL_STEPS[tutorialStep];

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
          <h1 className={classes.title}>Guessing sound direction - tutorial</h1>

          {tutorialStep === -1 && (
            <>
              <Image
                src={'/dashboard.png'}
                alt='tutorial image'
                width={820}
                height={420}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  alignSelf: 'center',
                  height: '50%',
                  width: '100%',
                  maxWidth: 820,
                }}
                priority
              />
              <p className={classes.paragraph} style={{ marginTop: '24px' }}>
                <strong>
                  Time for the second (and last) interactive part of the test.{' '}
                </strong>
                Get ready to learn how to navigate through the testing platform.
                This simple step-by-step guide will show you how to guess the
                direction of sounds in a virtual environment. It wll walk you
                through the basics of controlling guessed sound direction, and
                much more. Let&apos;s start this auditory adventure!
              </p>
            </>
          )}
          {currentStep && (
            <div className={classes.step} key={currentStep.title}>
              <h2>{currentStep.title}</h2>
              <Image
                key={currentStep.image}
                src={currentStep.image}
                alt='tutorial image'
                width={820}
                height={420}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  height: '50%',
                  maxWidth: 820,
                }}
                priority
              />
              {currentStep.paragraphs.map((paragraph, i) => (
                <p key={paragraph.title} className={classes.paragraph}>
                  <b>{paragraph.title} </b> <br />
                  <ul
                    style={{
                      margin: 0,
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {paragraph.points.map((point, j) => (
                      <li key={j}>
                        <span dangerouslySetInnerHTML={{ __html: point }} />
                      </li>
                    ))}
                  </ul>
                </p>
              ))}
            </div>
          )}

          <div className={classes.buttons}>
            {tutorialStep > 0 && (
              <Button
                size='md'
                onClick={() => setTutorialStep(tutorialStep - 1)}
              >
                &larr; Previous step
              </Button>
            )}
            {tutorialStep < TUTORIAL_STEPS.length - 1 ? (
              <Button
                size='md'
                onClick={() => setTutorialStep(tutorialStep + 1)}
              >
                Next step &rarr;
              </Button>
            ) : (
              <Button size='md' onClick={handleStartTest}>
                Start test! 🚀
              </Button>
            )}
          </div>
        </div>
      </Layout>
    </Providers>
  );
}
