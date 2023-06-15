import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';
import { useSettingsStore } from '~/store/settings/useSettingsStore';

export const CameraRotation = () => {
  const { azimuth, elevation, setAzimuth, setElevation } = useSettingsStore();

  useFrame(({ camera }) => {
    const cameraRotationX = camera.rotation.x;
    const cameraRotationY = camera.rotation.y;
    const cameraRotationZ = camera.rotation.z;

    const elevation = cameraRotationX * 57.29;

    let angle = cameraRotationY * MathUtils.RAD2DEG;

    if (cameraRotationZ < 1.5 && cameraRotationY < 0) {
      angle = -angle;
    }

    if (cameraRotationZ < 1.5 && cameraRotationY > 0) {
      angle = 360 - angle;
    }

    if (cameraRotationZ > 1.5 && cameraRotationY < 0) {
      angle = 180 + -angle;
    }

    if (cameraRotationZ > 1.5 && cameraRotationY > 0) {
      angle = 180 + angle;
    }

    (window as any).elevation = elevation;
    (window as any).azimuth = angle;
  });

  return null;
};
