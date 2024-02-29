import { Button, createStyles } from '@mantine/core';
import { SceneType, useSettingsStore } from '~/store/settings/useSettingsStore';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { LocationGuessModal } from '../location-guess-modal/LocationGuessModal';

const useStyles = createStyles((theme) => ({
  sceneType: {
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    left: '48px',
    bottom: '20px',
    backdropFilter: 'blur(30px)',
    gap: '16px',
    '@media (max-width: 1000px)': {
      left: 'auto',
      right: '24px',
      top: '170px',
      bottom: 'auto',
      padding: 0,
    },
    '@media (max-width: 700px)': {
      top: '130px',
      left: '24px',
      right: 'auto',
    },
  },
  sceneTypeButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    '@media (max-width: 700px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
}));

type SceneSettingsProps = {
  isInsideView?: boolean;
};

export const SceneSettings = ({ isInsideView = false }: SceneSettingsProps) => {
  const mode = useSettingsStore((state) => state.appMode);
  const { classes } = useStyles();

  const setRandomAngles = useSettingsStore(
    ({ setRandomAngles }) => setRandomAngles
  );
  const sceneType = useSettingsStore(({ sceneType }) => sceneType);
  const setSceneType = useSettingsStore(({ setSceneType }) => setSceneType);

  const [isOpened, { open, close }] = useDisclosure(false);

  const isMobile = useMediaQuery('(max-width: 1000px)');

  const buttons = [
    {
      label: 'Outside view',
      sceneType: 'outside',
    },
    {
      label: 'Inside view',
      sceneType: 'inside',
    },

    {
      label: 'Combined view',
      sceneType: 'alt',
    },
  ].filter((button) => button.sceneType !== sceneType);

  return (
    <>
      <div className={classes.sceneType}>
        <div className={classes.sceneTypeButtons}>
          {buttons.map(({ label, sceneType }) => (
            <Button
              key={sceneType}
              size={'md'}
              onClick={() => setSceneType(sceneType as SceneType)}
            >
              {label}
            </Button>
          ))}
        </div>
        {mode === 'guess' && (
          <div className={classes.sceneTypeButtons}>
            <Button onClick={() => setRandomAngles()}>Randomize</Button>
            <Button onClick={() => open()}>Make a guess</Button>
          </div>
        )}
      </div>
      <LocationGuessModal isOpened={isOpened} onClose={close} />
    </>
  );
};
