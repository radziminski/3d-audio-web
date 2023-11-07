import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import { Vector3 } from 'three';

export const Arrow: React.FC = () => {
  const boxRef = useRef<THREE.Mesh>(null);

  useFrame(({ camera }) => {
    if (boxRef.current) {
      // Rotate the box based on the camera's rotation
      boxRef.current.rotation.x = camera.rotation.x;
      boxRef.current.rotation.y = camera.rotation.y;
      boxRef.current.rotation.z = camera.rotation.z;

      const distance = 3; // Distance from the camera
      const boxPosition = camera.position
        .clone()
        .add(camera.getWorldDirection(new Vector3()).multiplyScalar(distance));

      boxRef.current.position.copy(boxPosition);
    }
  });

  return (
    // <Box
    //   ref={boxRef}
    //   args={[1, 1, 1]}
    //   position={[0, 0, -1]}
    //   material-color='red'
    //   scale={0.3}
    // />
    <mesh ref={boxRef}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={'blue'} />
    </mesh>
  );
};
