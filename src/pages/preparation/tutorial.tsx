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
    title: '2: Understanding the Sound Space',
    paragraphs: [
      {
        title: 'Exploring the virtual environment:',
        points: [
          `There are 3 available scenes to help you identify the direction of incoming sounds: <strong>"Outside view"</strong>, <strong>"Inside view"</strong>, and <strong>"Combined view"</strong>.`,
          `In each view, your task is to determine the direction from which the sound is coming, focusing on its azimuth (horizontal angle) or elevation (vertical angle). The process for making your guess varies depending on the view selected.`,
          `During the test, you can choose whichever view is suiting you best. You can also freely switch between views at any time.`,
          `You can switch between views using buttons in left bottom corner of the screen.`,
        ],
      },
      {
        title: 'Your Task:',
        points: [
          `For each sound, use selected view to choose the direction where you believe the sound is coming from.`,
          `To make your task easier, you'll be asked to <strong>guess only the azimuth (horizontal angle)</strong> or <strong>elevation (vertical angle)</strong> of the sound - never both.`,
          `After you make a guess, the direction changes, and you should repeat guessing direction of the new sound.`,
          'To simplify the process, your guesses for azimuth will be limited to the multiple of 15° (0°, 15°, 30°, ..., 345°) and 45° for elevation(-90°, -45°, 0°, 45°, 90°).',
        ],
      },
    ],
    image: '/views.gif',
  } as const,
  {
    title: '3: Outside View',
    paragraphs: [
      {
        title: 'Navigating the outside view:',
        points: [
          `In the outside view, a person is sitting in the center of the screen, with an arrow floating around them. The arrow should indicates the direction of the incoming sound.`,
          `You are asked to adjust the arrow's position by using the controls located in the bottom right corner of the screen. These controls allow you to change the azimuth or elevation to point the arrow in the direction you believe the sound is coming from.`,
          `In each step <strong>one of the sliders will be disabled</strong> (you won't be able to change it). If the vertical slider is disabled, you should only guess the azimuth of the sound (the horizontal direction) and vice-versa.`,
          `The outside view is the default view. You will see it right after starting the test.`,
        ],
      },
    ],
    image: '/outside.gif',
  } as const,
  {
    title: '4: Inside View',
    paragraphs: [
      {
        title: 'Experiencing the inside view:',
        points: [
          `The inside view offers a first-person perspective, where you're asked to rotate the camera to align with the direction you think the sound is originating from.`,
          `This immersive view allows you to directly control the camera's orientation to better estimate the sound's azimuth or elevation.`,
        ],
      },
    ],
    image: '/inside.gif',
  } as const,
  {
    title: '5: Combined View',
    paragraphs: [
      {
        title: 'Understanding the combined view:',
        points: [
          `The combined view features a corpus in the center, representing the listener, surrounded by a sphere with small points indicating possible sound origins.`,
          `Your task is to select a small sphere that represents the direction you believe the sound is coming from. This view allows for zooming in, transitioning smoothly from a third-person to a first-person perspective, providing a unique method to guess the sound's direction.`,
        ],
      },
    ],
    image: '/combined.gif',
  } as const,
  {
    title: '6: Sound Controls',
    paragraphs: [
      {
        title: 'Choosing and controlling sound:',
        points: [
          `In the bottom right corner you will find controls for the sound.`,
          `Use select at the top to choose different sound tracks.`,
          `Play/Pause played sound using large blue "Play" button`,
          `The gain (volume) slider allows you to adjust how loud the sound is.`,
        ],
      },
      {
        title: 'Direction reference',
        points: [
          `At any point, you can <strong>press and hold the "Hold for reference" button</strong> 
          to temporarily reset the currently played sound to azimuth: 0&deg;, elevation: 0&deg; position 
          (sound originating from directly in front of you).`,
          `The sound will stay at frontal position as long as you are holding (pressing) the button. It will reset to the original direction once you release it.`,
          `Using this reference might be very helpful to better understand the direction of the sound you are currently hearing.`,
        ],
      },
    ],
    image: '/controls.gif',
  } as const,
  {
    title: '7: Current step information',
    paragraphs: [
      {
        title: 'Tracking your progress:',
        points: [
          `The top left corner of the screen keeps you informed about:`,
          `Your current step in the test.`,
          `The sound technology you're currently testing (blurred by default).`,
          `Your current guess for azimuth and elevation.`,
        ],
      },
    ],
    image: '/step-info.png',
  } as const,
  {
    title: '8: Making your guess',
    paragraphs: [
      {
        title: 'Ready to commit?',
        points: [
          `Once you've positioned the arrow, and you are ready to save the guess, click large "Make a guess!" button.`,
          `This saves your response and takes you to the next step (new sound direction).`,
        ],
      },
    ],
    image: '/guess.gif',
  } as const,
  {
    title: "9: It's a trap!",
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
    image: '/trap.gif',
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
                height={470}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  alignSelf: 'center',
                  height: '470px',
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
                height={470}
                style={{
                  objectFit: 'contain',
                  objectPosition: 'center',
                  alignSelf: 'center',
                  width: '100%',
                  height: '470px',
                  maxWidth: currentStep.image === '/direction.jpeg' ? 500 : 820,
                }}
                priority
                quality={70}
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
