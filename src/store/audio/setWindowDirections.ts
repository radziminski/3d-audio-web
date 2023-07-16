type SetWindowDirectionsProps = {
  azimuth?: number;
  elevation?: number;
};

export const setWindowDirections = ({
  azimuth,
  elevation,
}: SetWindowDirectionsProps) => {
  if (elevation) {
    (window as any).elevation = elevation;
  }
  if (azimuth) {
    (window as any).azimuth = azimuth;
  }
};
