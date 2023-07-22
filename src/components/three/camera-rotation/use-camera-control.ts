import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const useCameraControl = () => {
  const { camera, gl } = useThree();
  const orbitControlsRef = useRef<OrbitControls>();

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

    controls.saveState();

    return () => {
      controls.dispose();
    };
  }, [camera, gl]);

  return { orbitControlsRef };
};
