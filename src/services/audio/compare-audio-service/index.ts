import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { monoEncoder, binDecoder, orderLimiter } from 'ambisonics';
import { CommonAudioService } from '../common-audio-service';
import type { SupportedLibrary } from '~/hooks/use-redirect-to-library/useRedirectToLibrary';
import { SpatialPoint } from '~/helpers/3D/types';
import { getUniSphereCoordinates } from '~/helpers/3D/getUnitSphereCoordinates';
import { ResonanceAudio, Source } from 'resonance-audio';
import { roomDimensions, roomMaterials } from '../resonance-audio/constants';
import Omnitone from 'omnitone/build/omnitone.min.esm';
import HOAloader from '../js-ambisonics-hoa/custom-hoa-loader';
import initializeMachService from '../mach/Mach1Starter';

const OmnitoneLib = Omnitone as any;

export class CompareAudioService extends CommonAudioService {
  private static instance: CompareAudioService;
  private static isInitialized = false;
  public connectedLibrary:
    | SupportedLibrary
    | 'js-ambisonics-foa'
    | 'stereo-panner'
    | null
    | undefined;

  private defaultLibrary:
    | SupportedLibrary
    | 'js-ambisonics-foa'
    | 'stereo-panner'
    | null
    | undefined;

  // Js Ambisonics FOA
  private encoder: any;
  private decoder: any;

  // JS Ambisonics HOA
  private hoaEncoder: any;
  private hoaDecoder: any;
  private hoaLimiter: any;
  private hoaLoader: any;

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
  private stereoReplicationMergerNode: ChannelMergerNode;

  // Resonance
  private resonanceAudioScene: ResonanceAudio;
  private resonanceAudioSource: Source;

  private roomDimensions = roomDimensions;
  private roomMaterials = roomMaterials;

  // Stereo traps
  private stereoPannerNode: StereoPannerNode;

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

  private mach1Controls: any;

  private constructor(defaultLibrary?: SupportedLibrary) {
    super();

    this.stereoPannerNode = this.audioContext.createStereoPanner();

    // JS Ambisonics FOA
    this.encoder = new monoEncoder(this.audioContext, 1);
    this.decoder = new binDecoder(this.audioContext, 1);
    this.loadSample(
      'https://pyrapple.github.io/JSAmbisonics/examples/IRs/ambisonic2binaural_filters/aalto2016_N1.wav',
      (buffer) => this.decoder.updateFilters(buffer)
    );

    // JS Ambisonics HOA
    // define HOA encoder (panner)
    this.hoaEncoder = new monoEncoder(this.audioContext, 3);
    // define HOA order limiter (to show the effect of order)
    this.hoaLimiter = new orderLimiter(this.audioContext, 3, 3);
    // binaural HOA decoder
    this.hoaDecoder = new binDecoder(this.audioContext, 3);

    // Web audio API
    this.pannerNode = this.audioContext.createPanner();

    this.setPannerNodeDefaults();

    // Resonance
    this.resonanceAudioScene = new ResonanceAudio(this.audioContext);
    // Disabling room defaults since it modifies the output too much.
    this.setResonanceRoomDefaults();
    this.resonanceAudioScene.setAmbisonicOrder(3);

    // Omnitone
    this.foaRenderer = OmnitoneLib.createFOARenderer(this.audioContext, {});
    this.stereoReplicationMergerNode = this.audioContext.createChannelMerger(2);

    // Connect nodes
    this.stereoPannerNode.connect(this.gainNode);
    // JS Ambisonics FOA
    this.encoder.out.connect(this.decoder.in);
    this.decoder.out.connect(this.gainNode);
    // JS Ambisonics HOA
    this.hoaEncoder.out.connect(this.hoaLimiter.in);
    this.hoaLimiter.out.connect(this.hoaDecoder.in);
    this.hoaDecoder.out.connect(this.gainNode);
    // Web audio API
    this.pannerNode.connect(this.gainNode);
    // Resonance
    this.resonanceAudioScene.output.connect(this.gainNode);
    this.resonanceAudioSource = this.resonanceAudioScene.createSource();
    // Omnitone
    this.foaRenderer.initialize().then(() => {
      this.foaRenderer.output.connect(this.gainNode);
      this.foaRenderer.setRenderingMode('ambisonic');
      this.stereoReplicationMergerNode.connect(this.foaRenderer.input);
    });

    this.gainNode.connect(this.audioContext.destination);

    // JS Ambisonics FOA filters load
    this.hoaLoader = new HOAloader(
      this.audioContext,
      3,
      // 'IRs/ambisonic2binaural_filters/HOA3_BRIRs-medium.wav',
      // 'IRs/ambisonic2binaural_filters/HOA3_IRC_1008_virtual.wav',
      'IRs/ambisonic2binaural_filters/aalto2016_N3.wav',
      (audioBuffer: AudioBuffer) => this.hoaDecoder.updateFilters(audioBuffer)
    );
    this.hoaLoader.load();

    // MACH 1
    this.mach1Controls = initializeMachService();

    if (defaultLibrary) {
      this.defaultLibrary = defaultLibrary;
    }

    CompareAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false,
    defaultLibrary?: SupportedLibrary
  ): CompareAudioService | undefined {
    if (!CompareAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      CompareAudioService.instance = new CompareAudioService(defaultLibrary);
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

      case 'stereo-panner': {
        this.audioSource?.disconnect(this.stereoPannerNode);
      }

      case 'js-ambisonics-foa': {
        this.audioSource?.disconnect(this.encoder.in);

        return;
      }

      case 'js-ambisonics': {
        this.audioSource?.disconnect(this.hoaEncoder.in);

        return;
      }

      // case 'omnitone': {
      //   this.audioSource?.disconnect(
      //     this.foaRenderer.stereoReplicationMergerNode
      //   );

      //   return;
      // }

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
    newLibrary?:
      | SupportedLibrary
      | 'js-ambisonics-foa'
      | 'stereo-panner'
      | null
      | undefined
  ) {
    if (newLibrary === this.connectedLibrary) {
      return;
    }

    const library = newLibrary === undefined ? this.defaultLibrary : newLibrary;

    try {
      this.disconnectConnectedLibrary();
    } catch {
      console.log('error while disconnecting');
    }

    this.connectedLibrary = library;

    if (!library) {
      this.audioSource?.connect(this.gainNode);
    }

    if (library === 'stereo-panner') {
      this.audioSource?.connect(this.stereoPannerNode);
    }

    if (library === 'js-ambisonics-foa') {
      this.audioSource?.connect(this.encoder.in);
    }

    if (library === 'js-ambisonics') {
      this.audioSource?.connect(this.hoaEncoder.in);
    }

    if (library === 'web-api') {
      this.audioSource?.connect(this.pannerNode);
    }

    if (library === 'resonance') {
      this.audioSource?.connect(this.resonanceAudioSource.input);
    }

    this.setDirection({ azimuth: this.azimuth, elevation: this.elevation });
  }

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    if (azimuth !== undefined) {
      this.azimuth = azimuth;
    }

    if (elevation !== undefined) {
      this.elevation = elevation;
    }

    if (this.connectedLibrary === 'mach1') {
      this.mach1Controls.setAzimuth(this.azimuth);
      this.mach1Controls.setElevation(this.elevation);

      return;
    }

    if (this.connectedLibrary === 'js-ambisonics-foa') {
      this.encoder.azim = -this.azimuth;
      this.encoder.elev = this.elevation;
      this.encoder.updateGains();

      return;
    }

    if (this.connectedLibrary === 'js-ambisonics') {
      this.hoaEncoder.azim = -this.azimuth;
      this.hoaEncoder.elev = this.elevation;
      this.hoaEncoder.updateGains();

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
  }

  setSourcePosition({ x, y, z }: SpatialPoint): void {}

  setPanner(pan: 'left-only' | 'right-only' | 'center') {
    if (pan === 'left-only') {
      this.stereoPannerNode.pan.value = -1;
      return;
    }

    if (pan === 'center') {
      this.stereoPannerNode.pan.value = 0;
      return;
    }

    this.stereoPannerNode.pan.value = 1;
  }

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }

  public setSourceForMach(source: string, onLoad: () => void) {
    this.mach1Controls.prepare(source, onLoad);
  }

  public machPlay() {
    this.mach1Controls?.play();
  }

  public machPause() {
    this.mach1Controls?.pause();
  }

  public setOutputGain(gain: number): void {
    this.gainNode.gain.value = gain;
    this.mach1Controls.setGain(gain);
  }
}
