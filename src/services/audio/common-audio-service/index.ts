import { SpatialDirection } from '../types';
import { DEFAULT_ELEVATION, DEFAULT_AZIMUTH } from '../constants';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../../helpers/3D/getUnitSphereCoordinates';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';

export abstract class CommonAudioService {
  protected audioContext: AudioContext;
  protected gainNode: GainNode;
  protected audioSource: MediaElementAudioSourceNode | null = null;

  protected elevation = DEFAULT_ELEVATION; // -90 - 90
  protected azimuth = DEFAULT_AZIMUTH; // 0 - 360

  protected constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
  }

  public init(): void {
    // init logic
  }

  public isAudioElementLinked() {
    return Boolean(this.audioSource);
  }

  abstract connectAudioSource(): void;

  public linkAudioElement(audioElement: HTMLAudioElement): void {
    if (this.isAudioElementLinked()) {
      throw new Error(
        'Audio element already linked in JsAmbisonicsAudioService'
      );
    }

    this.audioSource = this.audioContext.createMediaElementSource(audioElement);
    this.connectAudioSource();
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
  }

  abstract setSourcePosition({ x, y, z }: SpatialPoint): void;

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
    this.setDirection(getRandomAzimuthElevation());
  }
}
