import { SpatialPoint } from '~/helpers/3D/types';
import { ResonanceAudio, Source } from 'resonance-audio';
import { roomDimensions, roomMaterials } from './constants';
import { CommonAudioService } from '../common-audio-service';

export class ResonanceAudioService extends CommonAudioService {
  private static instance: ResonanceAudioService;
  private static isInitialized = false;

  private resonanceAudioScene: ResonanceAudio;
  private resonanceAudioSource: Source;

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
}
