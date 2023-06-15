import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { Wall } from '../wall/Wall';
import { Arrow } from '../arrow/Arrow';
import { Euler } from 'three';
import { CameraRotation } from '../camera-rotation/CameraRotation';

export const SceneInside = () => {
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
      <Wall position={[0, 5, 0]} scale={[10, 0.2, 10]} color='#999' />
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

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        position={[0, 0, 0]}
        minDistance={0.5}
        maxDistance={0.5}
      />
      <Arrow />
      <CameraRotation />
    </Canvas>
  );
};
