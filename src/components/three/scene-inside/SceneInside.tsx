import { Canvas } from '@react-three/fiber';
import { Box, Sphere, Text } from '@react-three/drei';
import { Wall } from '../wall/Wall';
import { Arrow } from '../arrow/Arrow';
import { CameraRotation } from '../camera-rotation/CameraRotation';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DoubleSide } from 'three';

export const SceneInside = () => {
  const orbitControlsRef = useRef<typeof OrbitControls>(null);

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[-1, 1, 1]} angle={0.15} intensity={0.1} />
      <pointLight position={[-1, -1, -1]} />

      {/* Front wall */}
      <Wall position={[0, 0, -5]} scale={[10, 10, 0.2]} color='#888' />
      <Text
        position={[0, 0, -4.8]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 0, 0]}
      >
        Front
      </Text>

      {/* Back wall */}
      <Wall position={[0, 0, 5]} scale={[10, 10, 0.2]} color='#888' />
      <Text
        position={[0, 0, 4.8]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 3.14, 0]}
      >
        Back
      </Text>

      {/* Right wall */}
      <Wall position={[5, 0, 0]} scale={[0.2, 10, 10]} color='#777' />
      <Text
        position={[4.8, 0, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[0, -1.57, 0]}
      >
        Right
      </Text>

      {/* Left wall */}
      <Wall position={[-5, 0, 0]} scale={[0.2, 10, 10]} color='#777' />
      <Text
        position={[-4.8, 0, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 1.57, 0]}
      >
        Left
      </Text>

      {/* Ceiling */}
      {/* <Wall position={[0, 5, 0]} scale={[10, 0.2, 10]} color='#999' /> */}
      <Text
        position={[0, 4.8, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[1.57, 0, 0]}
      >
        Ceiling
      </Text>

      {/* Floor */}
      <Wall position={[0, -5, 0]} scale={[10, 0.2, 10]} color='#999' />
      <Text
        position={[0, -4.8, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[-1.57, 0, 0]}
      >
        Floor
      </Text>

      <Box material-color='hotpink' />
      <Sphere args={[5, 64, 64]}>
        <meshStandardMaterial color='#777' side={DoubleSide} transparent />
      </Sphere>

      <Sphere args={[5, 64, 64]}>
        <meshStandardMaterial color='red' wireframe />
      </Sphere>

      {/* <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        position={[0, 0, 0]}
        minDistance={0.5}
        maxDistance={0.5}
      /> */}
      <Arrow />
      <CameraRotation />
    </Canvas>
  );
};
