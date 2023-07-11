import { SpatialPoint } from '~/helpers/3D/types';
import { CommonAudioService } from '../common-audio-service';
import Omnitone from 'omnitone/build/omnitone.min.esm';
import { SpatialDirection } from '../types';

const OmnitoneLib = Omnitone as any;

export class OmnitoneService extends CommonAudioService {
  private static instance: OmnitoneService;
  private static isInitialized = false;

  private foaRenderer: any;

  private constructor() {
    super();

    // connect nodes
    this.gainNode.connect(this.audioContext.destination);

    this.foaRenderer = OmnitoneLib.createFOARenderer(this.audioContext, {});

    OmnitoneService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): OmnitoneService | undefined {
    if (!OmnitoneService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      OmnitoneService.instance = new OmnitoneService();
    }

    return OmnitoneService.instance;
  }

  public static checkIsInitialized() {
    return OmnitoneService.isInitialized;
  }

  public connectAudioSource() {
    this.foaRenderer.initialize().then(() => {
      this.audioSource?.connect(this.foaRenderer.input);
      this.foaRenderer.output.connect(this.gainNode);
      this.foaRenderer.setRenderingMode('ambisonic');
    });
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    // Assume the listener is at the origin (0, 0, 0)
    const listenerPosition = { x: 0, y: 0, z: 0 };

    // Assume the sound source position on the unit sphere
    var soundSourcePosition = { x, y, z };

    // Calculate the direction vector from listener to sound source
    var directionVector = {
      x: -soundSourcePosition.x - listenerPosition.x,
      y: -soundSourcePosition.y - listenerPosition.y,
      z: soundSourcePosition.z - listenerPosition.z,
    };

    // Normalize the direction vector
    var length = Math.sqrt(
      directionVector.x * directionVector.x +
        directionVector.y * directionVector.y +
        directionVector.z * directionVector.z
    );
    directionVector.x /= length;
    directionVector.y /= length;
    directionVector.z /= length;

    // Calculate the rotation matrix
    var rotationMatrix = [
      directionVector.x,
      0,
      -directionVector.z, // Column 1 (X-axis)
      directionVector.y,
      1,
      directionVector.x, // Column 2 (Y-axis)
      directionVector.z,
      0,
      directionVector.x, // Column 3 (Z-axis)
    ];

    // Pass the rotation matrix to the Omnitone renderer
    this.foaRenderer.setRotationMatrix3(rotationMatrix);
  }
}
