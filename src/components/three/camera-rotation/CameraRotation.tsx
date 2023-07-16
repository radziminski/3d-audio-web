import { useDebouncedState } from '@mantine/hooks';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';
import { setWindowDirections } from '~/store/audio/setWindowDirections';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const CameraRotation = () => {
  const isSettingRef = useRef(false);

  const mode = useSettingsStore((state) => state.appMode);

  const setAzimuth = useSettingsStore((state) => state.setAzimuth);
  const setElevation = useSettingsStore((state) => state.setElevation);

  const [value, setValue] = useDebouncedState(
    { azimuth: 0, elevation: 0 },
    200
  );

  useEffect(() => {
    isSettingRef.current = false;
    setAzimuth(360 - value.azimuth);
    setElevation(value.elevation);
  }, [setAzimuth, setElevation, value]);

  useFrame(({ camera }) => {
    const vector = new Vector3();

    const { x, y, z } = camera.getWorldDirection(vector);
    const azimuthDegree = radToDeg(Math.atan2(x, z)) + 180;

    const azimuth = roundToDecimal(360 - azimuthDegree);
    const elevation = roundToDecimal(radToDeg(Math.asin(y)));

    if (mode === 'guess') {
      setWindowDirections({ azimuth, elevation });

      return;
    }

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
