import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '../box/Box';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Sphere } from '../sphere/Sphere';
import { Plane } from '../plane/Plane';
import { useTestStore } from '~/store/settings/useTestStore';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';

export const Scene = () => {
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

  const sourcePosition = isPlaygroundMode
    ? ([x * -1.1, y * 1.1, z * 1.1] as const)
    : ([
        guessSourcePosition.x,
        guessSourcePosition.y,
        guessSourcePosition.z,
      ] as const);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} intensity={0.1} />
      <pointLight position={[-10, -10, -10]} />
      <Box position={[0, 0, 0]} scale={0.6} />
      <Plane position={[0, -0.5, 0]} />
      <Sphere position={sourcePosition} />
      <OrbitControls minDistance={2.0} maxDistance={10.0} />
    </Canvas>
  );
};
