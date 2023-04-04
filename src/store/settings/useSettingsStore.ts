import { create } from 'zustand';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../helpers/3D/getUnitSphereCoordinates';
import {
  DEFAULT_AZIMUTH,
  DEFAULT_ELEVATION,
} from '../../services/audio/constants';

interface SettingsState {
  azimuth: number;
  elevation: number;
  gain: number;
  panning: number;
  sourcePosition: SpatialPoint;
  setAzimuth: (newAzimuth: number) => void;
  setElevation: (newElevation: number) => void;
  setGain: (newGain: number) => void;
  setPanning: (newPanning: number) => void;
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  azimuth: DEFAULT_AZIMUTH,
  elevation: DEFAULT_ELEVATION,
  gain: 100,
  panning: 0,
  sourcePosition: { x: 0, y: 0, z: 1 },
  setAzimuth: (newAzimuth) => {
    const { elevation } = get();
    const sourcePosition = getUniSphereCoordinates(newAzimuth, elevation);
    set({ azimuth: newAzimuth, sourcePosition });
  },
  setElevation: (newElevation) => {
    const { azimuth } = get();
    const sourcePosition = getUniSphereCoordinates(azimuth, newElevation);
    set({ elevation: newElevation, sourcePosition });
  },
  setGain: (newGain) => {
    set({ gain: newGain });
  },
  setPanning: (newPanning) => {
    set({ panning: newPanning });
  },
}));
