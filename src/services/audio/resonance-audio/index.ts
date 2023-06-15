import { SpatialDirection } from '../types';
import { DEFAULT_ELEVATION, DEFAULT_AZIMUTH } from '../constants';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '../../../helpers/3D/getUnitSphereCoordinates';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { ResonanceAudio, Source } from 'resonance-audio';
import { roomDimensions, roomMaterials } from './constants';

export class ResonanceAudioService {
  private static instance: ResonanceAudioService;
  private static isInitialized = false;
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private audioSource: MediaElementAudioSourceNode | null = null;
  private resonanceAudioScene: ResonanceAudio;
  private resonanceAudioSource: Source;

  private elevation = DEFAULT_ELEVATION; // -90 - 90
  private azimuth = DEFAULT_AZIMUTH; // 0 - 360

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
    this.audioContext = new AudioContext();
    this.resonanceAudioScene = new ResonanceAudio(this.audioContext);
    this.setResonanceRoomDefaults();
    this.gainNode = this.audioContext.createGain();
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

  public init(): void {
    // init logic
  }

  public linkAudioElement(audioElement: HTMLAudioElement): void {
    if (this.isAudioElementLinked()) {
      throw new Error('Audio element already linked in ResonanceAudioService');
    }

    this.audioSource = this.audioContext.createMediaElementSource(audioElement);
    this.audioSource.connect(this.resonanceAudioSource.input);
  }

  public isAudioElementLinked() {
    return Boolean(this.audioSource);
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
  }

  public setSourcePosition({ x, y, z }: SpatialPoint) {
    this.resonanceAudioSource.setPosition(x, y, z);
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
    this.setDirection(getRandomAzimuthElevation());
  }

  public static checkIsInitialized() {
    return ResonanceAudioService.isInitialized;
  }
}
