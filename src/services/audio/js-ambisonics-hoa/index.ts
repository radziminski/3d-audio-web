import { SpatialDirection } from '../types';
import { getRandomAzimuthElevation } from '~/helpers/3D/getRadomAzimuthElevation';
import { monoEncoder, binDecoder, orderLimiter } from 'ambisonics';
import { CommonAudioService } from '../common-audio-service';
import HOAloader from './custom-hoa-loader';

export class JsAmbisonicsHoaAudioService extends CommonAudioService {
  private static instance: JsAmbisonicsHoaAudioService;
  private static isInitialized = false;

  private encoder: any;
  private limiter: any;
  private loader: any;
  private decoder: any;

  private encoders: any[] = [];
  private limiters: any[] = [];
  private loaders: any;
  private decoders: any[] = [];

  private constructor() {
    super();

    this.encoder = new monoEncoder(this.audioContext, 3);
    // define HOA order limiter (to show the effect of order)
    this.limiter = new orderLimiter(this.audioContext, 3, 3);
    // binaural HOA decoder
    this.decoder = new binDecoder(this.audioContext, 3);

    // connect nodes
    this.encoder.out.connect(this.limiter.in);
    this.limiter.out.connect(this.decoder.in);
    this.decoder.out.connect(this.gainNode);

    this.gainNode.connect(this.audioContext.destination);

    // JS Ambisonics FOA filters load
    this.loader = new HOAloader(
      this.audioContext,
      3,
      // 'IRs/ambisonic2binaural_filters/HOA3_BRIRs-medium.wav',
      // 'IRs/ambisonic2binaural_filters/HOA3_IRC_1008_virtual.wav',
      'IRs/ambisonic2binaural_filters/aalto2016_N3.wav',
      (audioBuffer: AudioBuffer) => this.decoder.updateFilters(audioBuffer)
    );
    this.loader.load();

    JsAmbisonicsHoaAudioService.isInitialized = true;
  }

  public static getInstance(
    shouldInitialize = false
  ): JsAmbisonicsHoaAudioService | undefined {
    if (!JsAmbisonicsHoaAudioService.instance) {
      if (!shouldInitialize) {
        return undefined;
      }

      JsAmbisonicsHoaAudioService.instance = new JsAmbisonicsHoaAudioService();
    }

    return JsAmbisonicsHoaAudioService.instance;
  }

  public static checkIsInitialized() {
    return JsAmbisonicsHoaAudioService.isInitialized;
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

  public async createAndConnectSources(
    n: number,
    filePath: string
  ): Promise<void> {
    await this.createBuffers(n, filePath);

    for (const buffer of this.audioBuffers) {
      const encoder = new monoEncoder(this.audioContext, 3) as any;
      // define HOA order limiter (to show the effect of order)
      const limiter = new orderLimiter(this.audioContext, 3, 3) as any;
      // binaural HOA decoder
      const decoder = new binDecoder(this.audioContext, 3) as any;

      // connect nodes
      encoder.out.connect(limiter.in);
      limiter.out.connect(decoder.in);
      decoder.out.connect(this.gainNode);

      encoder.azim = Math.round(Math.random() * 360);
      encoder.elev = Math.round(Math.random() * 180 - 90);
      encoder.updateGains();

      this.encoders.push(encoder);
      this.limiters.push(limiter);
      this.decoders.push(decoder);

      buffer.connect(encoder.in);
    }

    this.loaders = new HOAloader(
      this.audioContext,
      3,
      // 'IRs/ambisonic2binaural_filters/HOA3_BRIRs-medium.wav',
      // 'IRs/ambisonic2binaural_filters/HOA3_IRC_1008_virtual.wav',
      'IRs/ambisonic2binaural_filters/aalto2016_N3.wav',
      (audioBuffer: AudioBuffer) =>
        this.decoders.forEach((decoder) => decoder.updateFilters(audioBuffer))
    );

    this.loaders.load();
  }
}
