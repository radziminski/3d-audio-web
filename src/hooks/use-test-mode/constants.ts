export const TEST_ANGLES = [
  // Azimuth
  {
    azimuth: 0,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 90,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 90 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 180,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 180 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 270,
    elevation: 0,
    type: 'azimuth',
  } as const,
  {
    azimuth: 270 + 45,
    elevation: 0,
    type: 'azimuth',
  } as const,
  // Elevation
  {
    azimuth: 0,
    elevation: -90,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: -45,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 0,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 45,
    type: 'elevation',
  } as const,
  {
    azimuth: 0,
    elevation: 90,
    type: 'elevation',
  } as const,
  // Traps
  {
    azimuth: 0,
    elevation: 0,
    isBypassed: true,
    type: 'bypassed',
  } as const,
  {
    azimuth: 0,
    elevation: 0,
    isBypassed: true,
    type: 'bypassed',
  } as const,
  {
    azimuth: 270,
    elevation: 0,
    isBypassed: false,
    type: 'left-only',
  } as const,
  {
    azimuth: 90,
    elevation: 0,
    isBypassed: false,
    type: 'right-only',
  } as const,
];
