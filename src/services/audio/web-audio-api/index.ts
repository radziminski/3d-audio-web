import { SpatialPoint } from '~/helpers/3D/types';
import { CommonAudioService } from '../common-audio-service';

export class WebAudioApiService extends CommonAudioService {
  private static instance: WebAudioApiService;
  private static isInitialized = false;

  private pannerNode: PannerNode;

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
    super();

    this.pannerNode = this.audioContext.createPanner();
    this.setPannerNodeDefaults();
    this.gainNode = this.audioContext.createGain();
    // connect nodes
    this.pannerNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    WebAudioApiService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): WebAudioApiService | undefined {
    if (!WebAudioApiService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      WebAudioApiService.instance = new WebAudioApiService();
    }

    return WebAudioApiService.instance;
  }

  public static checkIsInitialized() {
    return WebAudioApiService.isInitialized;
  }

  public connectAudioSource() {
    this.audioSource?.connect(this.pannerNode);
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    this.pannerNode.positionX.value = x;
    this.pannerNode.positionY.value = y;
    this.pannerNode.positionZ.value = z;
  }
}
