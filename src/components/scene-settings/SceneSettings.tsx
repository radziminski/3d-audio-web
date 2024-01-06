import { Button, createStyles } from '@mantine/core';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useDisclosure } from '@mantine/hooks';
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
  const sceneType = useSettingsStore(({ sceneType }) => sceneType);
  const setSceneType = useSettingsStore(({ setSceneType }) => setSceneType);

  const [isOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className={classes.sceneType}>
        <div className={classes.sceneTypeButtons}>
          <Button
            size='lg'
            onClick={() =>
              setSceneType(sceneType === 'outside' ? 'inside' : 'outside')
            }
          >
            Change view
          </Button>
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
