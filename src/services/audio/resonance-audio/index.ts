import { SpatialPoint } from '~/helpers/3D/types';
import { ResonanceAudio, Source } from 'resonance-audio';
import { roomDimensions, roomMaterials } from './constants';
import { CommonAudioService } from '../common-audio-service';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';

export class ResonanceAudioService extends CommonAudioService {
  private static instance: ResonanceAudioService;
  private static isInitialized = false;

  private resonanceAudioScene: ResonanceAudio;
  private resonanceAudioSource: Source;

  private resonanceAudioScenes: ResonanceAudio[] = [];
  private resonanceAudioSources: Source[] = [];

  private roomDimensions = roomDimensions;
  private roomMaterials = roomMaterials;

  private setResonanceRoomDefaults() {
    this.roomDimensions = roomDimensions;
    this.roomMaterials = roomMaterials;

    this.resonanceAudioScene.setRoomProperties(
      this.roomDimensions,
      this.roomMaterials
    );
  }

  private constructor() {
    super();

    this.resonanceAudioScene = new ResonanceAudio(this.audioContext);
    this.setResonanceRoomDefaults();

    // connect nodes
    this.resonanceAudioScene.output.connect(this.gainNode);
    this.resonanceAudioSource = this.resonanceAudioScene.createSource();
    this.gainNode.connect(this.audioContext.destination);

    ResonanceAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): ResonanceAudioService | undefined {
    if (!ResonanceAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      ResonanceAudioService.instance = new ResonanceAudioService();
    }

    return ResonanceAudioService.instance;
  }

  public static checkIsInitialized() {
    return ResonanceAudioService.isInitialized;
  }

  public connectAudioSource() {
    this.audioSource?.connect(this.resonanceAudioSource.input);
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    this.resonanceAudioSource.setPosition(x, y, z);
  }

  public async createAndConnectSources(
    n: number,
    filePath: string
  ): Promise<void> {
    await this.createBuffers(n, filePath);

    for (const buffer of this.audioBuffers) {
      const resonanceAudioScene = new ResonanceAudio(this.audioContext);
      resonanceAudioScene.setRoomProperties(
        this.roomDimensions,
        this.roomMaterials
      );

      // connect nodes
      resonanceAudioScene.output.connect(this.gainNode);

      const resonanceAudioSource = this.resonanceAudioScene.createSource();

      const randomAzimuth = Math.round(Math.random() * 360);
      const randomElevation = Math.round(Math.random() * 180 - 90);

      const randomSourcePosition = getUniSphereCoordinates(
        randomAzimuth,
        randomElevation
      );

      resonanceAudioSource.setPosition(
        randomSourcePosition.x,
        randomSourcePosition.y,
        randomSourcePosition.z
      );

      // Connect each source to its panner and then to the gain node
      buffer.connect(resonanceAudioSource.input);

      this.resonanceAudioScenes.push(resonanceAudioScene);
      this.resonanceAudioSources.push(resonanceAudioSource);
    }
  }

  public randomizeAngles() {
    for (let i = 0; i < this.resonanceAudioSources.length; i++) {
      const randomAzimuth = Math.round(Math.random() * 360);
      const randomElevation = Math.round(Math.random() * 180 - 90);

      const randomSourcePosition = getUniSphereCoordinates(
        randomAzimuth,
        randomElevation
      );

      this.resonanceAudioSources[i].setPosition(
        randomSourcePosition.x,
        randomSourcePosition.y,
        randomSourcePosition.z
      );
    }
  }
}
