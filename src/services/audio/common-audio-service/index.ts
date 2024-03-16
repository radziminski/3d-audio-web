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

  protected audioBuffers: AudioBufferSourceNode[] = [];

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

  public async loadAudioFile(filePath: string): Promise<AudioBuffer> {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(arrayBuffer);
  }

  public async createBuffers(n: number, filePath: string): Promise<void> {
    const audioBuffer = await this.loadAudioFile(filePath);

    for (let i = 0; i < n; i++) {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;

      this.audioBuffers.push(source);
    }
  }

  public playAllSources(): void {
    this.audioBuffers.forEach((source, index) => {
      if (source.buffer) {
        console.log('playing');
        // Check if the buffer is loaded
        setTimeout(() => {
          try {
            source.start(0);
          } catch {}
        }, index * 100);
      }
    });
  }
}
