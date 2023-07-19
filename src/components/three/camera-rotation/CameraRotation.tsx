import { useDebouncedState } from '@mantine/hooks';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { degToRad, radToDeg } from 'three/src/math/MathUtils';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

const setCameraAngle = ({
  azimuth,
  elevation,
  camera,
}: {
  azimuth: number;
  elevation: number;
  camera: any;
}) => {
  const azimuthRad = degToRad(360 - azimuth);
  const elevationRad = degToRad(elevation);

  const x = Math.sin(elevationRad) * Math.sin(azimuthRad);
  const y = Math.cos(elevationRad);
  const z = Math.sin(elevationRad) * Math.cos(azimuthRad);

  const target = new Vector3(x, y, z);
  console.log(target);
  camera.lookAt(target);
};

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

  const azimuthGuess = useTestStore((state) => state.azimuthGuess);
  const elevationGuess = useTestStore((state) => state.elevationGuess);
  const isRotatedRef = useRef(false);

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
    if (!isRotatedRef.current) {
      isRotatedRef.current = true;
      setCameraAngle({
        azimuth: azimuthGuess,
        elevation: elevationGuess,
        camera,
      });
    }
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
