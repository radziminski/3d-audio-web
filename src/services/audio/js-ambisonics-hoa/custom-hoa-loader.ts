import { JS_AMBISONICS_BASE_URL } from './constants';

// Define a type for the callback function
type LoadCallback = (buffer: AudioBuffer) => void;

export default class HOAloader {
  context: AudioContext;
  order: number;
  nCh: number;
  nChGroups: number;
  buffers: AudioBuffer[];
  loadCount: number;
  loaded: boolean;
  onLoad: LoadCallback;
  urls: string[];
  fileExt: string;
  concatBuffer: AudioBuffer | undefined;

  constructor(
    context: AudioContext,
    order: number,
    url: string,
    callback: LoadCallback
  ) {
    this.context = context;
    this.order = order;
    this.nCh = (order + 1) * (order + 1);
    this.nChGroups = Math.ceil(this.nCh / 8);
    this.buffers = [];
    this.loadCount = 0;
    this.loaded = false;
    this.onLoad = callback;
    this.urls = new Array(this.nChGroups);

    const fileExt = url.slice(url.length - 3);
    this.fileExt = fileExt;

    for (let i = 0; i < this.nChGroups; i++) {
      const startChannel = i * 8 + 1;
      const endChannel = i === this.nChGroups - 1 ? this.nCh : (i + 1) * 8;
      this.urls[i] =
        JS_AMBISONICS_BASE_URL +
        `${url.slice(0, url.length - 4)}_${pad(startChannel, 2)}-${pad(
          endChannel,
          2
        )}ch.${fileExt}`;

      console.log(this.urls[i]);
    }

    function pad(num: number, size: number): string {
      return ('000000000' + num).substr(-size);
    }
  }

  loadBuffers(url: string, index: number): void {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.context.decodeAudioData(
        request.response,
        (buffer) => {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          this.buffers[index] = buffer;
          this.loadCount++;
          if (this.loadCount === this.nChGroups) {
            this.loaded = true;
            this.concatBuffers();
            console.log('HOAloader: all buffers loaded and concatenated');
            this.onLoad(this.concatBuffer as AudioBuffer);
          }
        },
        (error) => {
          alert(
            'Browser cannot decode audio data:  ' + url + '\n\nError: ' + error
          );
        }
      );
    };

    request.onerror = function () {
      alert('HOAloader: XHR error');
    };

    request.send();
  }

  load(): void {
    for (let i = 0; i < this.nChGroups; ++i) {
      this.loadBuffers(this.urls[i], i);
    }
  }

  concatBuffers(): void {
    if (!this.loaded) return;

    const length = this.buffers.reduce(
      (acc, b) => Math.max(acc, b.length),
      this.buffers[0].length
    );
    const srate = this.buffers[0].sampleRate;
    const remap8ChanFile =
      this.fileExt.toLowerCase() === 'ogg'
        ? [1, 3, 2, 7, 8, 5, 6, 4]
        : [1, 2, 3, 4, 5, 6, 7, 8];

    this.concatBuffer = this.context.createBuffer(this.nCh, length, srate);
    for (let i = 0; i < this.nChGroups; i++) {
      for (let j = 0; j < this.buffers[i].numberOfChannels; j++) {
        this.concatBuffer
          .getChannelData(i * 8 + j)
          .set(this.buffers[i].getChannelData(remap8ChanFile[j] - 1));
      }
    }
  }
}
