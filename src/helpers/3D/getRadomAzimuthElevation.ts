export const getRandomAzimuthElevation = () => {
  const azimuth = Math.random() * 360;
  const elevation = Math.random() * 180 - 90;

  return { azimuth, elevation };
};
