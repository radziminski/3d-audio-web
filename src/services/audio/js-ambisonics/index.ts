import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { monoEncoder, binDecoder } from 'ambisonics';
import { CommonAudioService } from '../common-audio-service';

export class JsAmbisonicsAudioService extends CommonAudioService {
  private static instance: JsAmbisonicsAudioService;
  private static isInitialized = false;

  private encoder: any;
  private decoder: any;

  private constructor() {
    super();

    this.encoder = new monoEncoder(this.audioContext, 1);
    this.decoder = new binDecoder(this.audioContext, 1);

    // connect nodes
    this.encoder.out.connect(this.decoder.in);
    this.decoder.out.connect(this.gainNode);

    this.gainNode.connect(this.audioContext.destination);

    JsAmbisonicsAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): JsAmbisonicsAudioService | undefined {
    if (!JsAmbisonicsAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      JsAmbisonicsAudioService.instance = new JsAmbisonicsAudioService();
    }

    return JsAmbisonicsAudioService.instance;
  }

  public static checkIsInitialized() {
    return JsAmbisonicsAudioService.isInitialized;
  }

  public connectAudioSource() {
    this.audioSource?.connect(this.encoder.in);
  }

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    if (azimuth) {
      this.azimuth = azimuth;
    }

    if (elevation) {
      this.elevation = elevation;
    }

    this.encoder.azim = azimuth;
    this.encoder.elev = elevation;
    this.encoder.updateGains();
  }

  setSourcePosition() {}

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }
}
