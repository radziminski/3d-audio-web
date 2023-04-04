import { SpatialDirection } from './types';
import { DEFAULT_ELEVATION, DEFAULT_AZIMUTH } from './constants';
import { round } from './helpers';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../helpers/3D/getUnitSphereCoordinates';

export class AudioService {
  private static instance: AudioService;
  private static isInitialized = false;
  private audioContext: AudioContext;
  private pannerNode: PannerNode;
  private gainNode: GainNode;
  private audioSource: MediaElementAudioSourceNode | null = null;

  private elevation = DEFAULT_ELEVATION; // -90 - 90
  private azimuth = DEFAULT_AZIMUTH; // 0 - 360

  private setPannerNodeDefaults() {
    this.pannerNode.panningModel = 'HRTF';
    this.pannerNode.distanceModel = 'inverse';
    this.pannerNode.refDistance = 1;
    this.pannerNode.maxDistance = 1;
    this.pannerNode.rolloffFactor = 1;
    this.pannerNode.coneInnerAngle = 360;
    this.pannerNode.coneOuterAngle = 0;
    this.pannerNode.coneOuterGain = 0;
  }

  private constructor() {
    this.audioContext = new AudioContext();
    this.pannerNode = this.audioContext.createPanner();
    this.setPannerNodeDefaults();
    this.gainNode = this.audioContext.createGain();
    // connect nodes
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    AudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): AudioService | undefined {
    if (!AudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public init(): void {
    // init logic
  }

  public linkAudioElement(audioElement: HTMLAudioElement): void {
    if (this.isAudioElementLinked()) {
      throw new Error('Audio element already linked in AudioService');
    }

    this.audioSource = this.audioContext.createMediaElementSource(audioElement);
    this.audioSource.connect(this.pannerNode);
  }

  public isAudioElementLinked() {
    return Boolean(this.audioSource);
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    this.pannerNode.positionX.value = x;
    this.pannerNode.positionY.value = y;
    this.pannerNode.positionZ.value = z;
  }

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    if (azimuth) {
      this.azimuth = azimuth;
    }

    if (elevation) {
      this.elevation = elevation;
    }

    this.setSourcePosition(
      getUniSphereCoordinates(this.azimuth, this.elevation)
    );
  }

  public randomizeSourcePosition() {
    const azimuth = Math.random() * 360;
    const elevation = Math.random() * 180 - 90;
    this.setDirection({ azimuth, elevation });
  }

  public static checkIsInitialized() {
    return AudioService.isInitialized;
  }
}
