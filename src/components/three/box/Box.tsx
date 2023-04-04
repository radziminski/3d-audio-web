import { ThreeElements } from '@react-three/fiber';
import { useRef, useState } from 'react';

export const Box = (props: ThreeElements['mesh']) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  return (
    <mesh
      {...props}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'orange'} />
      <arrowHelper scale={1.5} />
    </mesh>
  );
};
