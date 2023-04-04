import { ThreeElements } from '@react-three/fiber';
import { useRef, useState } from 'react';

export const Plane = (props: ThreeElements['mesh']) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[8, 0.1, 8]} />
      <meshStandardMaterial color={'black'} transparent opacity={0.15} />
    </mesh>
  );
};
