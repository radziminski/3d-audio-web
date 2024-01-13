import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

export const useCameraControl = () => {
  const { camera, gl } = useThree();
  const orbitControlsRef = useRef<OrbitControls>();

  const appMode = useSettingsStore((state) => state.appMode);
  const guessType = useTestStore((state) => state.guessType);

  useEffect(() => {
    setTimeout(() => {
      orbitControlsRef.current?.reset();
    });
  }, []);

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    orbitControlsRef.current = controls;

    controls.minDistance = 0.5;
    controls.maxDistance = 0.5;
    controls.position0 = new Vector3(0, 0, 0);
    controls.enableZoom = false;
    controls.enableZoom = false;
    controls.enableRotate = true;

    const isRestrictionEnabled = appMode === 'test';
    const isAzimuthOnly =
      guessType === 'azimuth' ||
      guessType === 'left-only' ||
      guessType === 'right-only' ||
      guessType === 'bypassed';

    if (isRestrictionEnabled) {
      if (isAzimuthOnly) {
        controls.maxAzimuthAngle = Infinity; // Full horizontal rotation
        controls.minAzimuthAngle = Infinity; // Full horizontal rotation
        controls.maxPolarAngle = MathUtils.degToRad(90);
        controls.minPolarAngle = MathUtils.degToRad(90);
      } else {
        controls.maxAzimuthAngle = 0;
        controls.minAzimuthAngle = 0;
        controls.maxPolarAngle = Math.PI; // Full vertical rotation
        controls.minPolarAngle = 0; // Full vertic
      }
    }

    controls.saveState();

    return () => {
      controls.dispose();
    };
  }, [appMode, camera, gl, guessType]);

  return { orbitControlsRef };
};
