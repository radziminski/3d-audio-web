import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { CommonAudioService } from '../common-audio-service';
import { SpatialPoint } from '~/helpers/3D/types';
import initializeMachService from '../mach/Mach1Starter';

export class Mach1AudioService extends CommonAudioService {
  private static instance: Mach1AudioService;
  private static isInitialized = false;

  private mach1Controls: any;

  private constructor() {
    super();

    this.gainNode.connect(this.audioContext.destination);

    // MACH 1
    this.mach1Controls = initializeMachService();

    Mach1AudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): Mach1AudioService | undefined {
    if (!Mach1AudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      Mach1AudioService.instance = new Mach1AudioService();
    }

    return Mach1AudioService.instance;
  }

  public static checkIsInitialized() {
    return Mach1AudioService.isInitialized;
  }

  public connectAudioSource() {}

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    this.mach1Controls.setAzimuth(azimuth);
    this.mach1Controls.setElevation(elevation);

    return;
  }

  setSourcePosition({ x, y, z }: SpatialPoint): void {}

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }

  public setSourceForMach(source: string, onLoad: () => void) {
    this.mach1Controls.prepare(source, onLoad);
  }

  public machPlay() {
    console.log('play');
    this.mach1Controls?.play();
  }

  public machPause() {
    this.mach1Controls?.pause();
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
    this.mach1Controls.setGain(gain);
  }
}
