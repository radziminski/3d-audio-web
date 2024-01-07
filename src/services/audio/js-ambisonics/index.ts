import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { monoEncoder, binDecoder } from 'ambisonics';
import { CommonAudioService } from '../common-audio-service';

export class JsAmbisonicsAudioService extends CommonAudioService {
  private static instance: JsAmbisonicsAudioService;
  private static isInitialized = false;

  private encoder: any;
  private decoder: any;

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

    this.encoder = new monoEncoder(this.audioContext, 1);
    this.decoder = new binDecoder(this.audioContext, 1);
    this.loadSample(
      'https://pyrapple.github.io/JSAmbisonics/examples/IRs/ambisonic2binaural_filters/aalto2016_N1.wav',
      (buffer) => this.decoder.updateFilters(buffer)
    );

    // connect nodes
    this.encoder.out.connect(this.decoder.in);
    this.decoder.out.connect(this.gainNode);

    this.gainNode.connect(this.audioContext.destination);

    JsAmbisonicsAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): JsAmbisonicsAudioService | undefined {
    if (!JsAmbisonicsAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      JsAmbisonicsAudioService.instance = new JsAmbisonicsAudioService();
    }

    return JsAmbisonicsAudioService.instance;
  }

  public static checkIsInitialized() {
    return JsAmbisonicsAudioService.isInitialized;
  }

  public connectAudioSource() {
    this.audioSource?.connect(this.encoder.in);
  }

  public setDirection({ azimuth, elevation }: SpatialDirection): void {
    if (azimuth) {
      this.azimuth = azimuth;
    }

    if (elevation) {
      this.elevation = elevation;
    }

    this.encoder.azim = azimuth;
    this.encoder.elev = elevation;
    this.encoder.updateGains();
  }

  setSourcePosition() {}

  public randomizeSourcePosition() {
    this.setDirection(getRandomAzimuthElevation());
  }
}
