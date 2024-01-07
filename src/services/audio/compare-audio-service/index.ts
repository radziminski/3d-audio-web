import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import {
  monoEncoder,
  binDecoder,
  sceneMirror,
  intensityAnalyser,
  orderLimiter,
} from 'ambisonics';
import { CommonAudioService } from '../common-audio-service';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';
import { ResonanceAudio, Source } from 'resonance-audio';
import { roomDimensions, roomMaterials } from '../resonance-audio/constants';
import Omnitone from 'omnitone/build/omnitone.min.esm';
import HOAloader from '../js-ambisonics/custom-hoa-loader';

const OmnitoneLib = Omnitone as any;

export class CompareAudioService extends CommonAudioService {
  private static instance: CompareAudioService;
  private static isInitialized = false;
  private connectedLibrary:
    | SupportedLibrary
    | 'js-ambisonics-hoa'
    | null
    | undefined;

  // Js Ambisonics FOA
  private encoder: any;
  private decoder: any;

  // JS Ambisonics HOA
  private foaEncoder: any;
  private foaDecoder: any;
  private foaLimiter: any;
  private foaLoader: any;

  // Web audio API
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

  // Omnitone
  private foaRenderer: any;

  // Resonance
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

  private loadSample(
    url: string,
    doAfterLoading: (buffer: AudioBuffer) => void
  ) {
    const fetchSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
    fetchSound.open('GET', url, true); // Path to Audio File
    fetchSound.responseType = 'arraybuffer'; // Read as Binary Data
    fetchSound.onload = () => {
      this.audioContext.decodeAudioData(fetchSound.response, (buffer) =>
        doAfterLoading(buffer)
      );
    };
    fetchSound.send();
  }

  private constructor() {
    super();

    // JS Ambisonics FOA
    this.encoder = new monoEncoder(this.audioContext, 1);
    this.decoder = new binDecoder(this.audioContext, 1);
    this.loadSample(
      'https://pyrapple.github.io/JSAmbisonics/examples/IRs/ambisonic2binaural_filters/aalto2016_N1.wav',
      (buffer) => this.decoder.updateFilters(buffer)
    );

    // JS Ambisonics HOA
    // define HOA encoder (panner)
    this.foaEncoder = new monoEncoder(this.audioContext, 3);
    // define HOA order limiter (to show the effect of order)
    this.foaLimiter = new orderLimiter(this.audioContext, 3, 3);
    // binaural HOA decoder
    this.foaDecoder = new binDecoder(this.audioContext, 3);

    // Web audio API
    this.pannerNode = this.audioContext.createPanner();

    this.setPannerNodeDefaults();

    // Resonance
    this.resonanceAudioScene = new ResonanceAudio(this.audioContext);
    this.setResonanceRoomDefaults();

    // Omnitone
    this.foaRenderer = OmnitoneLib.createFOARenderer(this.audioContext, {});

    // Connect nodes
    // JS Ambisonics FOA
    this.encoder.out.connect(this.decoder.in);
    this.decoder.out.connect(this.gainNode);
    // JS Ambisonics HOA
    this.foaEncoder.out.connect(this.foaLimiter.in);
    this.foaLimiter.out.connect(this.foaDecoder.in);
    this.foaDecoder.out.connect(this.gainNode);
    // Web audio API
    this.pannerNode.connect(this.gainNode);
    // Resonance
    this.resonanceAudioScene.output.connect(this.gainNode);
    this.resonanceAudioSource = this.resonanceAudioScene.createSource();
    // Omnitone
    this.foaRenderer.initialize().then(() => {
      this.foaRenderer.output.connect(this.gainNode);
      this.foaRenderer.setRenderingMode('ambisonic');
    });

    this.gainNode.connect(this.audioContext.destination);

    // JS Ambisonics FOA filters load
    this.foaLoader = new HOAloader(
      this.audioContext,
      3,
      'IRs/ambisonic2binaural_filters/HOA3_BRIRs-medium.wav',
      (audioBuffer: AudioBuffer) => this.foaDecoder.updateFilters(audioBuffer)
    );
    this.foaLoader.load();

    CompareAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): CompareAudioService | undefined {
    if (!CompareAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      CompareAudioService.instance = new CompareAudioService();
    }

    return CompareAudioService.instance;
  }

  public static checkIsInitialized() {
    return CompareAudioService.isInitialized;
  }

  private disconnectConnectedLibrary() {
    switch (this.connectedLibrary) {
      case null: {
        this.audioSource?.disconnect(this.gainNode);
        return;
      }

      case undefined: {
        this.audioSource?.disconnect(this.gainNode);
        return;
      }

      case 'js-ambisonics': {
        this.audioSource?.disconnect(this.encoder.in);

        return;
      }

      case 'js-ambisonics-hoa': {
        this.audioSource?.disconnect(this.foaEncoder.in);

        return;
      }

      case 'omnitone': {
        this.audioSource?.disconnect(this.foaRenderer.input);

        return;
      }

      case 'resonance': {
        this.audioSource?.disconnect(this.resonanceAudioSource.input);

        return;
      }

      case 'web-api': {
        this.audioSource?.disconnect(this.pannerNode);

        return;
      }
    }
  }

  public connectAudioSource(
    library?: SupportedLibrary | 'js-ambisonics-hoa' | null
  ) {
    if (library === this.connectedLibrary) {
      return;
    }

    try {
      console.log('disconnecting ', this.connectedLibrary);
      this.disconnectConnectedLibrary();
      console.log('disconnected successfully');
    } catch {
      console.log('error while disconnecting');
    }

    console.log();
    console.log('connecting ', library);
    console.log('audio source', this.audioSource);

    this.connectedLibrary = library;

    if (!library) {
      this.audioSource?.connect(this.gainNode);
    }

    if (library === 'js-ambisonics') {
      this.audioSource?.connect(this.encoder.in);
    }

    if (library === 'js-ambisonics-hoa') {
      this.audioSource?.connect(this.foaEncoder.in);
    }

    if (library === 'web-api') {
      this.audioSource?.connect(this.pannerNode);
    }

    if (library === 'resonance') {
      this.audioSource?.connect(this.resonanceAudioSource.input);
    }

    if (library === 'omnitone') {
      this.audioSource?.connect(this.foaRenderer.input);
    }

    this.setDirection({ azimuth: this.azimuth, elevation: this.elevation });

    console.log('connecting success');
  }

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    if (azimuth !== undefined) {
      this.azimuth = azimuth;
    }

    if (elevation !== undefined) {
      this.elevation = elevation;
    }

    console.log('setting', this.connectedLibrary, this.azimuth, this.elevation);

    if (this.connectedLibrary === 'js-ambisonics') {
      this.encoder.azim = -this.azimuth;
      this.encoder.elev = this.elevation;
      this.encoder.updateGains();

      return;
    }

    if (this.connectedLibrary === 'js-ambisonics-hoa') {
      this.foaEncoder.azim = -this.azimuth;
      this.foaEncoder.elev = this.elevation;
      this.foaEncoder.updateGains();

      return;
    }

    const { x, y, z } = getUniSphereCoordinates(
      azimuth ?? this.azimuth,
      elevation ?? this.elevation
    );

    if (this.connectedLibrary === 'web-api') {
      this.pannerNode.positionX.value = x;
      this.pannerNode.positionY.value = y;
      this.pannerNode.positionZ.value = z;

      return;
    }

    if (this.connectedLibrary === 'resonance') {
      this.resonanceAudioSource.setPosition(x, y, z);

      return;
    }

    if (this.connectedLibrary === 'omnitone') {
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

      return;
    }
  }

  setSourcePosition({ x, y, z }: SpatialPoint): void {}

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }
}
