export const TEST_ANGLES = [
  // top
  {
    azimuth: 0,
    elevation: 90,
  },
  // elevation - 45deg
  {
    azimuth: 45,
    elevation: 45,
  },
  {
    azimuth: 90 + 45,
    elevation: 45,
  },
  {
    azimuth: 180 + 45,
    elevation: 45,
  },
  {
    azimuth: 270 + 45,
    elevation: 45,
  },
  // elevation - 0deg
  {
    azimuth: 0,
    elevation: 0,
  },
  {
    azimuth: 45,
    elevation: 0,
  },
  {
    azimuth: 90,
    elevation: 0,
  },
  {
    azimuth: 90 + 45,
    elevation: 0,
  },
  {
    azimuth: 180,
    elevation: 0,
  },
  {
    azimuth: 180 + 45,
    elevation: 0,
  },
  {
    azimuth: 270,
    elevation: 0,
  },
  {
    azimuth: 270 + 45,
    elevation: 0,
  },
  // elevation - -45deg
  {
    azimuth: 45,
    elevation: -45,
  },
  {
    azimuth: 90 + 45,
    elevation: -45,
  },
  {
    azimuth: 180 + 45,
    elevation: -45,
  },
  {
    azimuth: 270 + 45,
    elevation: -45,
  },
  // bottom
  {
    azimuth: 0,
    elevation: -90,
  },
  // traps
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
