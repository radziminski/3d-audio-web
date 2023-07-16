import { Button, createStyles } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useDisclosure } from '@mantine/hooks';
import { LocationGuessModal } from '../location-guess-modal/LocationGuessModal';

const useStyles = createStyles((theme) => ({
  sceneType: {
    background:
      'linear-gradient(to bottom right, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.1))',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'fixed',
    left: '48px',
    bottom: '48px',
    backdropFilter: 'blur(30px)',
    gap: '16px',
  },
  sceneTypeButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
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
  const setSceneType = useSettingsStore(({ setSceneType }) => setSceneType);

  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className={classes.sceneType}>
        <div className={classes.sceneTypeButtons}>
          <Button onClick={() => setSceneType('outside')}>Outside view</Button>
          <Button onClick={() => setSceneType('inside')}>Inside view</Button>
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
