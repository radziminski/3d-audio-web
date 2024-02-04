import { useEffect } from 'react';
import { initMach } from '~/services/audio/mach/Mach';

export const Mach = () => {
  useEffect(() => {
    initMach();
  }, []);

  return <h1>Mach</h1>;
};
