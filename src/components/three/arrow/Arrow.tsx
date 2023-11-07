import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Box, Clone, useGLTF } from '@react-three/drei';
import { Euler, Group, Mesh, Vector3 } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export const Arrow: React.FC = () => {
  const arrowRef = useRef<Group>(null);

  // const { scene: arrow } = useGLTF('/arrow2.gltf');
  const arrow = useLoader(OBJLoader, '/arrow2.obj');
  const boxRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    arrow.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.color.set('#e600ff');
      }
    });
  }, [arrow]);

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

      arrowRef.current?.setRotationFromEuler(
        new Euler(Math.PI / (2 - (boxPosition.y + 0.8) * 0.1), 0, Math.PI / 2)
      );
    }
  });

  return (
    <mesh ref={boxRef}>
      <Clone
        ref={arrowRef}
        object={arrow}
        scale={0.1}
        rotation={[Math.PI / 1.7, 0, Math.PI / 2]}
      />{' '}
      <pointLight intensity={0.1} />
      {/* <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color={'blue'} /> */}
    </mesh>
  );
};
