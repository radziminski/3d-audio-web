import { ThreeElements, Vector3 } from '@react-three/fiber';
import { useRef, useState } from 'react';

type Props = {
  color?: string;
  opacity?: number;
  size?: [number, number, number];
} & ThreeElements['mesh'];

export const Plane = ({
  color = 'black',
  opacity = 0.15,
  size = [8, 0.1, 8],
  ...props
}: Props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
};
