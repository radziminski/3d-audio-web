import { roundToDecimal } from '../3D/getUnitSphereCoordinates';

export const getTimeDifference = (start: number, end: number) => {
  const timeMilliseconds = end - start;

  return roundToDecimal(timeMilliseconds / 1000);
};
