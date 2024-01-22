export function roundToNearest(
  azimuth: number,
  elevation: number
): { azimuth: number; elevation: number } {
  // Ensure azimuth is within the range 0 to 360
  const normalizedAzimuth = ((azimuth % 360) + 360) % 360;

  // Round azimuth to the nearest multiple of 15
  const roundedAzimuth = Math.round(normalizedAzimuth / 15) * 15;

  // Ensure elevation is within the range -90 to 90
  const clampedElevation = Math.max(-90, Math.min(90, elevation));

  // Round elevation to the nearest multiple of 15
  const roundedElevation = Math.round(clampedElevation / 45) * 45;

  const parsedAzimuth = roundedAzimuth >= 352.5 ? 0 : roundedAzimuth;

  return { azimuth: parsedAzimuth, elevation: roundedElevation };
}
