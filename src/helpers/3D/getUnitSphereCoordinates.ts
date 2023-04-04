import { SpatialPoint } from './types';

export const roundToDecimal = (value: number) => Math.round(value * 100) / 100;

export const getUniSphereCoordinates = (
  azimuth: number,
  elevation: number
): SpatialPoint => {
  // Convert angles from degrees to radians
  const azimuthRad = (azimuth * Math.PI) / 180;
  const elevationRad = (elevation * Math.PI) / 180;

  // Calculate x, y, and z components of the unit vector
  const z = Math.cos(elevationRad) * Math.cos(azimuthRad);
  const x = Math.cos(elevationRad) * Math.sin(azimuthRad);
  const y = Math.sin(elevationRad);

  // Normalize the vector to length 1
  const length = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
  const xNorm = roundToDecimal(x / length);
  const yNorm = roundToDecimal(y / length);
  const zNorm = roundToDecimal(z / length);

  return {
    x: xNorm,
    y: yNorm,
    z: zNorm,
  };
};
