import { Box, Text } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import { ColorRepresentation, MeshStandardMaterial } from 'three';

type Props = {
  position: Vector3;
  scale: Vector3;
  color?: ColorRepresentation;
};

export const Wall = ({ position, scale, color }: Props) => {
  return (
    <mesh position={position}>
      <Box
        scale={scale}
        material={new MeshStandardMaterial({ color: color ?? 'gray' })}
      />
    </mesh>
  );
};
