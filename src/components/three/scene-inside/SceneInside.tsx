import { Canvas } from '@react-three/fiber';
import { Box, Environment, Sphere, Text } from '@react-three/drei';
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
      <Environment
        files='/skybox.hdr'
        background={true} // can be true, false or "only" (which only sets the background) (default: false)
        blur={0.07} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
        scene={undefined} // adds the ability to pass a custom THREE.Scene, can also be a ref
        encoding={undefined} // adds the ability to pass a cust
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[-1, 1, 1]} angle={0.15} intensity={0.1} />
      <pointLight position={[-1, -1, -1]} />

      {/* Front wall */}
      {/* <Wall position={[0, 0, -5]} scale={[10, 10, 0.2]} color='#888' /> */}
      <Text
        position={[0, 0, -4.8]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 0, 0]}
      >
        Front
      </Text>
      <Text
        position={[0, -0.3, -4.8]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, -0.15, -4.9]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Back wall */}
      {/* <Wall position={[0, 0, 5]} scale={[10, 10, 0.2]} color='#888' /> */}
      <Text
        position={[0, 0, 4.8]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 3.14, 0]}
      >
        Back
      </Text>
      <Text
        position={[0, -0.3, 4.8]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 3.14, 0]}
      >
        azimuth: 180°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, -0.13, 4.98]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Right wall */}
      {/* <Wall position={[5, 0, 0]} scale={[0.2, 10, 10]} color='#777' /> */}
      <Text
        position={[4.8, 0, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[0, -1.57, 0]}
      >
        Right
      </Text>
      <Text
        position={[4.8, -0.3, 0]}
        color='blue'
        fontSize={0.1}
        rotation={[0, -1.57, 0]}
      >
        azimuth: 90°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[4.9, -0.13, 0]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Left wall */}
      {/* <Wall position={[-5, 0, 0]} scale={[0.2, 10, 10]} color='#777' /> */}
      <Text
        position={[-4.8, 0, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[0, 1.57, 0]}
      >
        Left
      </Text>
      <Text
        position={[-4.8, -0.3, 0]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 1.57, 0]}
      >
        azimuth: 270°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[-4.9, -0.13, 0]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Ceiling */}
      {/* <Wall position={[0, 5, 0]} scale={[10, 0.2, 10]} color='#999' /> */}
      <Text
        position={[0, 4.8, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[1.57, 0, 0]}
      >
        Top
      </Text>
      <Text
        position={[0, 4.8, -0.3]}
        color='blue'
        fontSize={0.1}
        rotation={[1.57, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: 90°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, 4.9, -0.15]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[0, 3.1, -3.35]}
        color='blue'
        fontSize={0.1}
        rotation={[1.57 / 2, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: 45°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, 3.5, -3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Floor */}
      {/* <Wall position={[0, -5, 0]} scale={[10, 0.2, 10]} color='#999' /> */}
      <Text
        position={[0, -4.8, 0]}
        color='blue'
        fontSize={0.4}
        rotation={[-1.57, 0, 0]}
      >
        Bottom
      </Text>
      <Text
        position={[0, -4.8, 0.3]}
        color='blue'
        fontSize={0.1}
        rotation={[-1.57, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: -90°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, -4.9, 0.15]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[0, -3.65, -3.35]}
        color='blue'
        fontSize={0.1}
        rotation={[-1.57 / 2, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: -45°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, -3.5, -3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[0, 3.1, -3.35]}
        color='blue'
        fontSize={0.1}
        rotation={[1.57 / 2, 0, 0]}
      >
        azimuth: 0°{'\n'}
        elevation: 45°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[0, 3.5, -3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[-3.5, -0.3, -3.5]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 1.57 / 2, 0]}
      >
        azimuth: 305°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[-3.5, -0.12, -3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[3.5, -0.3, -3.5]}
        color='blue'
        fontSize={0.1}
        rotation={[0, -1.57 / 2, 0]}
      >
        azimuth: 45°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[3.5, -0.12, -3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[3.5, -0.3, 3.5]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 3.14 + 1.57 / 2, 0]}
      >
        azimuth: 135°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[3.5, -0.12, 3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      <Text
        position={[-3.5, -0.3, 3.5]}
        color='blue'
        fontSize={0.1}
        rotation={[0, 1.57 + 1.57 / 2, 0]}
      >
        azimuth: 225°{'\n'}
        elevation: 0°
      </Text>
      <Sphere args={[0.04, 32, 32]} position={[-3.5, -0.12, 3.5]}>
        <meshStandardMaterial color='#a8328b' />
      </Sphere>

      {/* Big Spheres  */}

      <Box material-color='hotpink' />
      <Sphere args={[5, 64, 64]}>
        <meshStandardMaterial
          color='#777'
          side={DoubleSide}
          transparent
          opacity={0.5}
        />
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
