import { useCamera } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import { radToDeg } from 'three/src/math/MathUtils';
import { roundToDecimal } from '~/helpers/3D/getUnitSphereCoordinates';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const CameraRotation = () => {
  const { azimuth, elevation, setAzimuth, setElevation } = useSettingsStore();

  useFrame(({ camera }) => {
    var vector = new Vector3(); // create once and reuse it!
    const { x, y, z } = camera.getWorldDirection(vector);
    const azimuthDegree = radToDeg(Math.atan2(x, z)) + 180;
    const azimuth = roundToDecimal(360 - azimuthDegree);

    const elevation = radToDeg(Math.asin(y));

    (window as any).elevation = elevation;
    (window as any).azimuth = azimuth;
  });

  return null;
};
