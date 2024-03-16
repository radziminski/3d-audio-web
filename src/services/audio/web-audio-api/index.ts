import { SpatialPoint } from '~/helpers/3D/types';
import { CommonAudioService } from '../common-audio-service';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';

export class WebAudioApiService extends CommonAudioService {
  private static instance: WebAudioApiService;
  private static isInitialized = false;

  private pannerNode: PannerNode;

  private pannerNodes: PannerNode[] = [];
  private compressorNode: DynamicsCompressorNode;

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

    this.compressorNode = this.audioContext.createDynamicsCompressor();
    this.compressorNode.threshold.value = -50; // Threshold (dB)
    this.compressorNode.knee.value = 40; // Knee (dB)
    this.compressorNode.ratio.value = 12; // Ratio
    this.compressorNode.attack.value = 0; // Attack (seconds)
    this.compressorNode.release.value = 0.25; // Release (seconds)
    this.compressorNode.connect(this.gainNode);

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

  public async createAndConnectSources(
    n: number,
    filePath: string
  ): Promise<void> {
    await this.createBuffers(n, filePath);

    for (const buffer of this.audioBuffers) {
      const panner = this.audioContext.createPanner();
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 1; // Adjust according to needs
      panner.rolloffFactor = 1;
      panner.coneInnerAngle = 360;
      panner.coneOuterAngle = 0;
      panner.coneOuterGain = 0;

      const randomAzimuth = Math.random() * 360;
      const randomElevation = Math.random() * 180 - 90;

      const randomSourcePosition = getUniSphereCoordinates(
        randomAzimuth,
        randomElevation
      );

      panner.positionX.value = randomSourcePosition.x;
      panner.positionY.value = randomSourcePosition.y;
      panner.positionZ.value = randomSourcePosition.z;

      // Connect each source to its panner and then to the gain node
      buffer.connect(panner);
      panner.connect(this.compressorNode);

      this.pannerNodes.push(panner);
    }
  }
}
