import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { CommonAudioService } from '../common-audio-service';
import { SpatialPoint } from '~/helpers/3D/types';
import initializeMachService from '../mach/Mach1Starter';

export class Mach1AudioService extends CommonAudioService {
  private static instance: Mach1AudioService;
  private static isInitialized = false;

  private mach1Controls: any[] = [];

  private constructor() {
    super();

    this.gainNode.connect(this.audioContext.destination);

    // MACH 1
    this.mach1Controls.push(initializeMachService(0));

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
    this.mach1Controls[0].setAzimuth(azimuth);
    this.mach1Controls[0].setElevation(elevation);

    return;
  }

  setSourcePosition({ x, y, z }: SpatialPoint): void {}

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }

  public setSourceForMach(source: string, onLoad: () => void) {
    this.mach1Controls[0].prepare(source, onLoad);
  }

  public machPlay() {
    console.log('play');
    this.mach1Controls[0]?.play();
  }

  public machPause() {
    this.mach1Controls[0]?.pause();
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
    this.mach1Controls[0].setGain(gain);
  }

  public async createAndConnectSources(n: number): Promise<void> {
    for (let i = 1; i <= n; i++) {
      this.mach1Controls.push(initializeMachService(i));

      // this.mach1Controls[i].setAzimuth(Math.round(Math.random() * 360));
      // this.mach1Controls[i].setElevation(Math.round(Math.random() * 180 - 90));

      this.mach1Controls[i].setGain(10);

      this.mach1Controls[i].prepare(`/guitar.mp3`, () => {
        setTimeout(() => {
          this.mach1Controls[i].play();
        }, i * 100);
      });
    }
  }

  public randomizeAngles() {
    for (let i = 0; i < this.mach1Controls.length; i++) {
      this.mach1Controls[i].setAzimuth(Math.round(Math.random() * 360));
      this.mach1Controls[i].setElevation(Math.round(Math.random() * 180 - 90));
    }
  }
}
