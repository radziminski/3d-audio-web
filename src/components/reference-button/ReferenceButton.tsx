import { Button, createStyles } from '@mantine/core';
import { useDebouncedState } from '@mantine/hooks';
import { useEffect } from 'react';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

const useClasses = createStyles((theme) => ({
  bypassButton: {
    height: '48px',
    width: '100%',
    marginTop: '8px',
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '8px',
  },
  small: {
    paddingTop: '4px',
    fontSize: 12,
  },
}));

export const ReferenceButton = () => {
  const { classes } = useClasses();
  const setStoreIsReference = useSettingsStore((state) => state.setIsReference);
  const storeIsReference = useSettingsStore((state) => state.isReference);

  const [isReference, setIsReference] = useDebouncedState<boolean | undefined>(
    undefined,
    100
  );

  useEffect(() => {
    setStoreIsReference(isReference ?? false);
  }, [isReference, setStoreIsReference]);

  const setAngles = useSettingsStore((state) => state.setAngles);

  const currentAngle = useTestStore((state) => state.currentAngle);

  useEffect(() => {
    if (storeIsReference) {
      setAngles(0, 0);

      return;
    }

    if (storeIsReference === false) {
      setAngles(currentAngle?.azimuth ?? 0, currentAngle?.elevation ?? 0);
    }
  }, [
    storeIsReference,
    setAngles,
    currentAngle?.azimuth,
    currentAngle?.elevation,
  ]);

  return (
    <Button
      className={classes.bypassButton}
      onMouseDown={() => {
        setIsReference(true);
      }}
      onMouseUp={() => {
        setIsReference(false);
      }}
    >
      <div className={classes.content}>
        <div>Hold for reference</div>
        <div className={classes.small}>azimuth: 0&deg;, elevation: 0&deg;</div>
      </div>
    </Button>
  );
};
