import { SpatialDirection } from '../types';
import { DEFAULT_ELEVATION, DEFAULT_AZIMUTH } from '../constants';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../../helpers/3D/getUnitSphereCoordinates';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { monoEncoder, binDecoder } from 'ambisonics';

export class JsAmbisonicsAudioService {
  private static instance: JsAmbisonicsAudioService;
  private static isInitialized = false;
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private encoder: any;
  private decoder: any;

  private elevation = DEFAULT_ELEVATION; // -90 - 90
  private azimuth = DEFAULT_AZIMUTH; // 0 - 360

  private constructor() {
    this.audioContext = new AudioContext();
    this.encoder = new monoEncoder(this.audioContext, 1);
    this.decoder = new binDecoder(this.audioContext, 1);
    this.gainNode = this.audioContext.createGain();
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

  public init(): void {
    // init logic
  }

  public linkAudioElement(audioElement: HTMLAudioElement): void {
    if (this.isAudioElementLinked()) {
      throw new Error(
        'Audio element already linked in JsAmbisonicsAudioService'
      );
    }

    this.audioSource = this.audioContext.createMediaElementSource(audioElement);
    this.audioSource.connect(this.encoder.in);
  }

  public isAudioElementLinked() {
    return Boolean(this.audioSource);
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    //
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

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }

  public static checkIsInitialized() {
    return JsAmbisonicsAudioService.isInitialized;
  }
}
