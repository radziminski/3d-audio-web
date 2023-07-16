import { useDebouncedState } from '@mantine/hooks';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

export const CameraRotation = () => {
  const isSettingRef = useRef(false);

  const mode = useSettingsStore((state) => state.appMode);

  const setAzimuth = useSettingsStore((state) => state.setAzimuth);
  const setElevation = useSettingsStore((state) => state.setElevation);

  const setGuessedDirections = useTestStore(
    (state) => state.setGuessedDirections
  );

  const [value, setValue] = useDebouncedState(
    { azimuth: 0, elevation: 0 },
    200
  );

  useEffect(() => {
    isSettingRef.current = false;

    if (mode === 'playground') {
      setAzimuth(360 - value.azimuth);
      setElevation(value.elevation);
      return;
    }

    setGuessedDirections(value.azimuth, value.elevation);
  }, [mode, setAzimuth, setElevation, setGuessedDirections, value]);

  useFrame(({ camera }) => {
    const vector = new Vector3();

    const { x, y, z } = camera.getWorldDirection(vector);
    const azimuthDegree = radToDeg(Math.atan2(x, z)) + 180;

    const azimuth = roundToDecimal(360 - azimuthDegree);
    const elevation = roundToDecimal(radToDeg(Math.asin(y)));

    if (
      (azimuth !== value.azimuth || elevation !== value.elevation) &&
      !isSettingRef.current
    ) {
      isSettingRef.current = true;
      setValue({ azimuth, elevation });
    }
  });

  return null;
};
