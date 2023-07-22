import { roundToDecimal } from '../math/roundToDecimal';

export const getAzimuthError = (
  trueAzimuth: number,
  guessedAzimuth: number
) => {
  const error = Math.abs(trueAzimuth - guessedAzimuth);
  return roundToDecimal(Math.min(error, 360 - error));
};
