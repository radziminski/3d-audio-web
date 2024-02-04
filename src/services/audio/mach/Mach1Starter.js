import Mach1DecodeModule from './Mach1Decode';
import Mach1EncodeModule from './Mach1Encode';
import Mach1SoundPlayer from './Mach1SoundPlayer';

if (typeof window !== 'undefined') {
  window.m1Decode = null;
  window.m1Encode = null;
  window.mach1SoundPlayer = null;

  window.params = {
    // Mach1Encode Parameters
    inputKind: 0, // mono
    outputKind: 1, // 8 ch
    azimuth: 0,
    diverge: 0.5,
    elevation: 0,
    enableIsotropicEncode: true,
    sRotation: 0,
    sSpread: 0.5,
    autoOrbit: true,

    // Mach1Decode Parameters
    decoderRotationY: 0,
    decoderRotationP: 0,
    decoderRotationR: 0,
  };
}

export default function initializeMachService() {
  /*
    Initialize Mach1Decode Module and use some default settings
    */
  Mach1DecodeModule().then(function (m1DecodeModule) {
    window.m1Decode = new m1DecodeModule.Mach1Decode();
    window.m1Decode.setPlatformType(
      window.m1Decode.Mach1PlatformType.Mach1PlatformOfEasyCam
    );
    window.m1Decode.setDecodeAlgoType(
      window.m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoSpatial
    );
    window.m1Decode.setFilterSpeed(0.95);
  });

  /*
      Initialize Mach1Encode Module
      */
  Mach1EncodeModule().then(function (m1EncodeModule) {
    window.m1Encode = new m1EncodeModule.Mach1Encode();
  });

  const FRAMES_PER_SECOND = 60;

  var audioFiles;

  /*
      Function for setting up loading for audio in path
      currently using hardcoded example audio downloaded from
      running `download-audiofiles.sh` or `download-audiofiles.bat`
      */
  function loadSound(sound) {
    if (window.params.inputKind == 0) {
      // Input: MONO
      audioFiles = [sound];
    } else if (window.params.inputKind == 1) {
      // Input: STERO
      audioFiles = [sound, sound];
    } else if (window.params.inputKind == 2) {
      audioFiles = ['audio/quad/guitar-m1horizon.ogg'];
    } else {
      audioFiles = [sound];
    }

    if (window.mach1SoundPlayer) {
      window.mach1SoundPlayer.remove();
    }
    window.mach1SoundPlayer = new Mach1SoundPlayer(audioFiles);
  }

  var textlabels = [];
  var spheres = [];
  var lines = [];

  function toggleInputOutputKind() {
    if (window.params.inputKind == 0) {
      // Input: MONO
      window.m1Encode.setInputMode(
        window.m1Encode.Mach1EncodeInputModeType.Mach1EncodeInputModeMono
      );
    }

    if (window.params.outputKind == 0) {
      // Output: Mach1Horizon / Quad 4CH
      window.m1Encode.setOutputMode(
        window.m1Encode.Mach1EncodeOutputModeType.Mach1EncodeOutputModeM1Horizon
      );
    }
    if (window.params.outputKind == 1) {
      // Output: Mach1Spatial / Cuboid 8CH
      window.m1Encode.setOutputMode(
        window.m1Encode.Mach1EncodeOutputModeType.Mach1EncodeOutputModeM1Spatial
      );
    }

    // Resets the Decoding input when changing Encoding output between Mach1Spatial and Mach1Horizon
    if (window.params.outputKind == 0) {
      // Output: Mach1Horizon / Quad
      window.m1Decode.setDecodeAlgoType(
        window.m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoHorizon
      );
    }
    if (window.params.outputKind == 1) {
      // Output: Mach1Spatial / Cuboid
      window.m1Decode.setDecodeAlgoType(
        window.m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoSpatial
      );
    }

    window.m1Encode.generatePointResults();

    // cleanup
    for (var i = 0; i < spheres.length; i++) {
      scene.remove(spheres[i]);
      scene.remove(lines[i]);
    }
    spheres = [];
    lines = [];

    for (var i = 0; i < textlabels.length; i++) {
      textlabels[i].element.parentNode.removeChild(textlabels[i].element);
    }
    textlabels = [];
  }

  // update
  function update() {
    window.m1Encode.setAzimuth(window.params.azimuth);
    window.m1Encode.setElevation(window.params.elevation);
    window.m1Encode.setDiverge(window.params.diverge);
    // window.m1Encode.setStereoRotate(window.params.sRotation);
    // window.m1Encode.setStereoSpread(window.params.sSpread);
    window.m1Encode.setAutoOrbit(window.params.autoOrbit);
    window.m1Encode.setPannerMode(window.params.enableIsotropicEncode);
  }

  function updateTimeout() {
    if (
      window.m1Decode &&
      window.m1Encode &&
      window.mach1SoundPlayer &&
      window.mach1SoundPlayer.isReady()
    ) {
      update();
      toggleInputOutputKind();
    }
  }

  function __timeoutUpdateGains() {
    if (window.mach1SoundPlayer && window.mach1SoundPlayer.isPlaying()) {
      window.m1Encode.generatePointResults();

      window.m1Decode.beginBuffer();
      var decoded = window.m1Decode.decode(
        window.params.decoderRotationY,
        window.params.decoderRotationP,
        window.params.decoderRotationR
      );
      window.m1Decode.endBuffer();

      var vol = [];
      if (window.params.outputKind == 0) {
        // Output: Mach1Horizon / Quad
        vol = window.m1Encode.getResultingCoeffsDecoded(
          window.m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoHorizon,
          decoded
        );
      }
      if (window.params.outputKind == 1) {
        // Output: Mach1Spatial / Cuboid
        vol = window.m1Encode.getResultingCoeffsDecoded(
          window.m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoSpatial,
          decoded
        );
      }

      window.mach1SoundPlayer.gains = vol;
    }
  }

  setInterval(updateTimeout, 100);
  const updateInterval = setInterval(
    __timeoutUpdateGains,
    1000 / FRAMES_PER_SECOND
  );

  const resetAll = () => {
    clearInterval(updateInterval);
  };

  const prepare = (sound) => {
    loadSound(sound);
  };

  const play = () => {
    window.mach1SoundPlayer?.play(true);
  };

  const pause = () => {
    window.mach1SoundPlayer?.pause();
  };

  /**
   * Set azimuth
   * @param {0-360} azimuth
   */
  const setAzimuth = (azimuth) => {
    window.params.azimuth = azimuth / 360;
  };

  const setElevation = (elevation) => {
    window.params.elevation = elevation / 90;
  };

  const setGain = (gain) => {
    if (window.mach1SoundPlayer) window.mach1SoundPlayer.volume = gain * 5;
  };

  const controls = {
    prepare,
    play,
    pause,
    setAzimuth,
    setElevation,
    resetAll,
    setGain,
  };

  window.controls = controls;

  return controls;
}
