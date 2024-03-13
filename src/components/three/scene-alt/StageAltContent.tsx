import { useMouse } from '@mantine/hooks';
import {
  Box,
  OrbitControls,
  Torus,
  Text,
  Instance,
  Html,
  Clone,
} from '@react-three/drei';
import { Canvas, useFrame, useLoader, type Vector3 } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Euler, type Mesh } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Angles } from '~/hooks/use-test-mode/constants';
import { useSettingsStore } from '~/store/settings/useSettingsStore';
import { useTestStore } from '~/store/settings/useTestStore';

const DIVISIONS_AZIMUTH = 24;
const DIVISIONS_ELEVATION = 4;
const RADIUS = 10;

export const sphericalToCartesian = (
  r: number,
  azimuth: number,
  elevation: number
): Vector3 => {
  azimuth = deg2rad(azimuth);
  elevation = deg2rad(elevation);

  const t = r * Math.cos(elevation); // distance to y-axis after being rotated up
  const y = r * Math.sin(elevation);

  const x = t * Math.cos(azimuth);
  const z = t * Math.sin(azimuth);

  return [x, y, z];
};

export const deg2rad = (angle: number): number => angle * (Math.PI / 180);

const MeshHATS = ({
  position,
  rotation,
}: {
  position: Vector3;
  rotation?: [number, number, number];
}): JSX.Element => {
  const mesh = useRef<Mesh>(null);
  const obj = useLoader(OBJLoader, '/hats.obj');

  return (
    <mesh
      ref={mesh}
      position={position}
      rotation={rotation && new Euler(rotation[0], rotation[1], rotation[2])}
    >
      <primitive object={obj} />
    </mesh>
  );
};

const TargetSphere = ({
  position,
  onClick,
  active,
  highlight,
  isHoverDisabled,
  angles: { azimuth, elevation },
}: {
  position: Vector3;
  onClick: () => void;
  active?: boolean;
  highlight?: boolean;
  isHoverDisabled?: boolean;
  angles: Pick<Angles, 'azimuth' | 'elevation'>;
}): JSX.Element => {
  const [isHovered, setIsHovered] = useState(false);

  const getColor = (): string => {
    if (isHovered && active) return 'red';
    if (isHovered) return 'yellow';
    if (highlight) return 'red';
    if (active) return 'red';
    return 'white';
  };

  const [x, y, z] = position as any;

  const { x: mouseX, y: mouseY } = useMouse();

  const guessType = useTestStore((state) => state.guessType);
  const appMode = useSettingsStore((state) => state.appMode);
  const isElevationOnly = guessType === 'elevation';
  const isAzimuthOnly = [
    'azimuth',
    'left-only',
    'right-only',
    'bypassed',
  ].includes(guessType);

  const isEnabled =
    appMode === 'playground' ||
    (isAzimuthOnly && elevation === 0) ||
    (isElevationOnly && azimuth === 0) ||
    (!isElevationOnly && !isAzimuthOnly);

  return (
    <>
      {/* {isHovered && (
        <Text
          fontSize={0.4}
          position={sphericalToCartesian(8, azimuth + 90, elevation)}
          rotation={[0, -Math.PI / 2 - deg2rad(azimuth + 90), 0]}
        >
          Foo
        </Text>
      )} */}
      {isHovered && (
        <Html
          style={{
            position: 'fixed',
            left: mouseX - window.innerWidth / 2 - 120,
            top: mouseY - window.innerHeight / 2 - 80,
            color: 'white',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            padding: '8px',
            borderRadius: '8px',
            backdropFilter: 'blur(16px)',
          }}
        >
          Azimuth: {azimuth}° <br />
          Elevation: {elevation}°
        </Html>
      )}
      <mesh
        position={position}
        scale={isEnabled && isHovered ? 0.4 : 0.25}
        onClick={
          isEnabled
            ? () => {
                onClick();
              }
            : undefined
        }
        onPointerOver={
          isEnabled
            ? () => {
                !isHoverDisabled && setIsHovered(true);
              }
            : undefined
        }
        onPointerOut={
          isEnabled
            ? () => {
                setIsHovered(false);
              }
            : undefined
        }
      >
        <sphereGeometry args={[1]} />
        <meshStandardMaterial
          transparent
          opacity={isEnabled ? 1 : 0.3}
          color={getColor()}
        />
      </mesh>
    </>
  );
};

export const StageContent = ({
  selection,
  setSelection,
}: {
  selection: Pick<Angles, 'azimuth' | 'elevation'> | null;
  setSelection: (selection: Pick<Angles, 'azimuth' | 'elevation'>) => void;
}): JSX.Element => {
  const mode = useSettingsStore((state) => state.appMode);
  const isPlaygroundMode = mode === 'playground';

  const azimuthAngles = Array.from(
    { length: DIVISIONS_AZIMUTH },
    (_, i) => i * (360 / DIVISIONS_AZIMUTH)
  );
  const elevationAngles = Array.from(
    { length: DIVISIONS_ELEVATION + 1 },
    (_, i) => (i * 180) / DIVISIONS_ELEVATION - 90
  );

  const [clock] = useState(new THREE.Clock());
  const FPS_CAP = 30;

  useFrame(({ gl, scene, camera }) => {
    const timeUntilNextFrame = 1000 / FPS_CAP - clock.getDelta();

    setTimeout(() => {
      gl.render(scene, camera);
    }, Math.max(0, timeUntilNextFrame));
  }, 1);

  const arrow = useLoader(OBJLoader, '/arrow2.obj');

  return (
    <>
      <OrbitControls enablePan={false} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 15, 0]} />
      <pointLight position={[0, 5, 0]} intensity={1} />

      <MeshHATS position={[0, -1.5, 0]} />
      <Box position={[0, -2.5, 0]} scale={[4, 0.5, 4]}>
        <meshStandardMaterial color={'orange'} />
      </Box>

      <mesh position={[0, -0.8, 1.8]}>
        <Clone
          object={arrow}
          scale={[0.07, 0.07, 0.12]}
          rotation={[0, -3.14 / 2, 0]}
        />
        <meshStandardMaterial color={'orange'} />
      </mesh>

      {azimuthAngles.map((azimuth) =>
        elevationAngles.map((elevation) => {
          if ((elevation === -90 || elevation === 90) && azimuth !== 0)
            return null; // remove duplicate points on top and bottom
          return (
            <TargetSphere
              key={`azimuth:${azimuth}-elevation:${elevation}`}
              position={sphericalToCartesian(RADIUS, azimuth + 90, elevation)} // rotate azimuth 90 degrees to match viewing angle
              onClick={() => {
                setSelection({ azimuth: azimuth, elevation: elevation });
              }}
              active={
                selection?.azimuth === azimuth &&
                selection?.elevation === elevation
              }
              isHoverDisabled={false}
              angles={{ azimuth: azimuth, elevation: elevation }}
            />
          );
        })
      )}
      <Torus
        position={[0, 0, 0]}
        args={[RADIUS, 0.03]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={'#00d2ff'} />
      </Torus>
      <Torus
        position={[0, 7.1, 0]}
        args={[RADIUS / 1.4, 0.03]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={'#00d2ff'} />
      </Torus>
      <Torus
        position={[0, -7.1, 0]}
        args={[RADIUS / 1.4, 0.03]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color={'#00d2ff'} />
      </Torus>
      {azimuthAngles.map((azimuth) => (
        <Torus
          key={`ring${azimuth}`}
          position={[0, 0, 0]}
          args={[RADIUS, 0.03]}
          rotation={[0, deg2rad(azimuth + 90), 0]}
        >
          <meshStandardMaterial color={'#9bedff'} />
        </Torus>
      ))}
      {azimuthAngles.map(
        (azimuth) =>
          azimuth % 30 === 0 && (
            <Text
              key={`text${azimuth}`}
              position={[
                -Math.sin(deg2rad(azimuth + 1)) * RADIUS,
                0.5,
                Math.cos(deg2rad(azimuth + 1)) * RADIUS,
              ]}
              rotation={[0, -Math.PI / 2 - deg2rad(azimuth + 90), 0]}
              anchorX='left'
              fontSize={0.75}
            >
              {azimuth}°
            </Text>
          )
      )}
    </>
  );
};
