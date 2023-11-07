import { Canvas } from '@react-three/fiber';
import { Clone, OrbitControls, useGLTF } from '@react-three/drei';
import { Box } from '../box/Box';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Sphere } from '../sphere/Sphere';
import { Plane } from '../plane/Plane';
import { useTestStore } from '~/store/settings/useTestStore';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';
import { Group, Vector3 } from 'three';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

export const Scene = () => {
  const arrowRef = useRef<Group>(null);
  const [trigger, setTrigger] = useState(false);

  const { scene: arrow } = useGLTF('/arrow.glb');
  const { scene: man } = useGLTF('/man.glb');

  const mode = useSettingsStore((state) => state.appMode);
  const isPlaygroundMode = mode === 'playground';

  const {
    sourcePosition: { x, y, z },
  } = useSettingsStore();

  const azimuthGuess = useTestStore((state) => state.azimuthGuess);
  const elevationGuess = useTestStore((state) => state.elevationGuess);
  const guessSourcePosition = getUniSphereCoordinates(
    360 - azimuthGuess,
    elevationGuess
  );

  const sourcePosition = useMemo(
    () =>
      isPlaygroundMode
        ? ([x * -1.1, y * 1.1, z * 1.1] as const)
        : ([
            guessSourcePosition.x,
            guessSourcePosition.y,
            guessSourcePosition.z,
          ] as const),
    [
      guessSourcePosition.x,
      guessSourcePosition.y,
      guessSourcePosition.z,
      isPlaygroundMode,
      x,
      y,
      z,
    ]
  );

  useLayoutEffect(() => {
    if (arrowRef.current) {
      const arrowObject = arrowRef.current;
      const center = new Vector3(0, -100, 0);
      arrowObject.lookAt(center);

      const percentElev = sourcePosition[1] / 1.1;
      const threshold = 0.85;
      const smoother = 0.65;
      const distanceLeft = Math.abs(percentElev) - threshold;
      const dest = (1 - smoother) / (1 - threshold);
      const multiplier =
        distanceLeft > 0
          ? (Math.abs(percentElev) - threshold) * dest + smoother
          : smoother;
      arrowObject.rotateX((percentElev * Math.PI * multiplier) / 2);
    }
  }, [sourcePosition, trigger]);

  useLayoutEffect(() => {
    setTimeout(() => {
      setTrigger(true);
    }, 200);
  });

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} intensity={0.1} />
      <pointLight position={[-10, -10, -10]} />
      {/* <Box position={[0, 0, 0]} scale={0.6} /> */}
      <Clone object={man} scale={0.007} position={[0, -0.7, 0]} />
      <Plane position={[0, -0.5, 0]} />
      {/* <Sphere position={sourcePosition} /> */}
      <Clone
        ref={arrowRef}
        object={arrow}
        scale={0.06}
        position={sourcePosition}
      />
      <OrbitControls minDistance={2.0} maxDistance={10.0} />
    </Canvas>
  );
};
