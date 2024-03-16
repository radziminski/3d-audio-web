import Mach1DecodeModule from './Mach1Decode';
import Mach1EncodeModule from './Mach1Encode';
import Mach1SoundPlayer from './Mach1SoundPlayer';

const globalMachControls = [];

for (let i = 0; i < 1000; i++) {
  globalMachControls[i] = {};
  globalMachControls[i].m1Decode = null;
  globalMachControls[i].m1Encode = null;
  globalMachControls[i].mach1SoundPlayer = null;
  globalMachControls[i].params = {
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

export default function initializeMachService(index) {
  /*
    Initialize Mach1Decode Module and use some default settings
    */
  Mach1DecodeModule().then((m1DecodeModule) => {
    globalMachControls[index].m1Decode = new m1DecodeModule.Mach1Decode();
    globalMachControls[index].m1Decode.setPlatformType(
      globalMachControls[index].m1Decode.Mach1PlatformType
        .Mach1PlatformOfEasyCam
    );
    globalMachControls[index].m1Decode.setDecodeAlgoType(
      globalMachControls[index].m1Decode.Mach1DecodeAlgoType
        .Mach1DecodeAlgoSpatial
    );
    globalMachControls[index].m1Decode.setFilterSpeed(0.95);
  });
  /*
    Initialize Mach1Encode Module
    */
  Mach1EncodeModule().then((m1EncodeModule) => {
    globalMachControls[index].m1Encode = new m1EncodeModule.Mach1Encode();
  });
  const FRAMES_PER_SECOND = 60;
  var audioFiles;
  /*
    Function for setting up loading for audio in path
    currently using hardcoded example audio downloaded from
    running `download-audiofiles.sh` or `download-audiofiles.bat`
    */
  const loadSound = (sound, onLoad) => {
    if (globalMachControls[index].params.inputKind == 0) {
      // Input: MONO
      audioFiles = [sound];
    } else if (globalMachControls[index].params.inputKind == 1) {
      // Input: STERO
      audioFiles = [sound, sound];
    } else {
      audioFiles = [sound];
    }
    if (globalMachControls[index].mach1SoundPlayer) {
      globalMachControls[index].mach1SoundPlayer.remove();
    }
    globalMachControls[index].mach1SoundPlayer = new Mach1SoundPlayer(
      audioFiles,
      onLoad
    );
  };
  var textlabels = [];
  var spheres = [];
  var lines = [];

  const toggleInputOutputKind = () => {
    if (globalMachControls[index].params.inputKind == 0) {
      // Input: MONO
      globalMachControls[index].m1Encode.setInputMode(
        globalMachControls[index].m1Encode.Mach1EncodeInputModeType
          .Mach1EncodeInputModeMono
      );
    }
    if (globalMachControls[index].params.outputKind == 0) {
      // Output: Mach1Horizon / Quad 4CH
      globalMachControls[index].m1Encode.setOutputMode(
        globalMachControls[index].m1Encode.Mach1EncodeOutputModeType
          .Mach1EncodeOutputModeM1Horizon
      );
    }
    if (globalMachControls[index].params.outputKind == 1) {
      // Output: Mach1Spatial / Cuboid 8CH
      globalMachControls[index].m1Encode.setOutputMode(
        globalMachControls[index].m1Encode.Mach1EncodeOutputModeType
          .Mach1EncodeOutputModeM1Spatial
      );
    }
    // Resets the Decoding input when changing Encoding output between Mach1Spatial and Mach1Horizon
    if (globalMachControls[index].params.outputKind == 0) {
      // Output: Mach1Horizon / Quad
      globalMachControls[index].m1Decode.setDecodeAlgoType(
        globalMachControls[index].m1Decode.Mach1DecodeAlgoType
          .Mach1DecodeAlgoHorizon
      );
    }
    if (globalMachControls[index].params.outputKind == 1) {
      // Output: Mach1Spatial / Cuboid
      globalMachControls[index].m1Decode.setDecodeAlgoType(
        globalMachControls[index].m1Decode.Mach1DecodeAlgoType
          .Mach1DecodeAlgoSpatial
      );
    }
    globalMachControls[index].m1Encode.generatePointResults();
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
  };
  // update
  const update = () => {
    globalMachControls[index].m1Encode.setAzimuth(
      globalMachControls[index].params.azimuth
    );
    globalMachControls[index].m1Encode.setElevation(
      globalMachControls[index].params.elevation
    );
    globalMachControls[index].m1Encode.setDiverge(
      globalMachControls[index].params.diverge
    );
    // globalMachControls[index].m1Encode.setStereoRotate(globalMachControls[index].params.sRotation);
    // globalMachControls[index].m1Encode.setStereoSpread(globalMachControls[index].params.sSpread);
    globalMachControls[index].m1Encode.setAutoOrbit(
      globalMachControls[index].params.autoOrbit
    );
    globalMachControls[index].m1Encode.setPannerMode(
      globalMachControls[index].params.enableIsotropicEncode
    );
  };
  const updateTimeout = () => {
    if (
      globalMachControls[index].m1Decode &&
      globalMachControls[index].m1Encode &&
      globalMachControls[index].mach1SoundPlayer &&
      globalMachControls[index].mach1SoundPlayer.isReady()
    ) {
      update();
      toggleInputOutputKind();
    }
  };
  const __timeoutUpdateGains = () => {
    if (
      globalMachControls[index].mach1SoundPlayer &&
      globalMachControls[index].mach1SoundPlayer.isPlaying()
    ) {
      globalMachControls[index].m1Encode.generatePointResults();
      globalMachControls[index].m1Decode.beginBuffer();
      var decoded = globalMachControls[index].m1Decode.decode(
        globalMachControls[index].params.decoderRotationY,
        globalMachControls[index].params.decoderRotationP,
        globalMachControls[index].params.decoderRotationR
      );
      globalMachControls[index].m1Decode.endBuffer();
      var vol = [];
      if (globalMachControls[index].params.outputKind == 0) {
        // Output: Mach1Horizon / Quad
        vol = globalMachControls[index].m1Encode.getResultingCoeffsDecoded(
          globalMachControls[index].m1Decode.Mach1DecodeAlgoType
            .Mach1DecodeAlgoHorizon,
          decoded
        );
      }
      if (globalMachControls[index].params.outputKind == 1) {
        // Output: Mach1Spatial / Cuboid
        vol = globalMachControls[index].m1Encode.getResultingCoeffsDecoded(
          globalMachControls[index].m1Decode.Mach1DecodeAlgoType
            .Mach1DecodeAlgoSpatial,
          decoded
        );
      }
      globalMachControls[index].mach1SoundPlayer.gains = vol;
    }
  };
  setInterval(updateTimeout, 100);
  const updateInterval = setInterval(
    __timeoutUpdateGains,
    1000 / FRAMES_PER_SECOND
  );
  const resetAll = () => {
    clearInterval(updateInterval);
  };
  const prepare = (sound, onLoad) => {
    loadSound(sound, onLoad, index);
  };
  const play = () => {
    globalMachControls[index].mach1SoundPlayer?.play(true);
  };
  const pause = () => {
    globalMachControls[index].mach1SoundPlayer?.pause();
  };
  /**
   * Set azimuth
   * @param {0-360} azimuth
   */
  const setAzimuth = (azimuth) => {
    globalMachControls[index].params.azimuth = azimuth / 360;
  };
  const setElevation = (elevation) => {
    globalMachControls[index].params.elevation = elevation / 90;
  };
  const setGain = (gain) => {
    if (globalMachControls[index].mach1SoundPlayer)
      globalMachControls[index].mach1SoundPlayer.volume = gain * 5;
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
  globalMachControls[index].controls = controls;
  return controls;
}

// const globalMachControls = [];

// for (let i = 0; i < 1000; i++) {
//   globalMachControls[index] = {};

//   globalMachControls[index].m1Decode = null;
//   globalMachControls[index].m1Encode = null;
//   globalMachControls[index].mach1SoundPlayer = null;

//   globalMachControls[index].params = {
//     // Mach1Encode Parameters
//     inputKind: 0, // mono
//     outputKind: 1, // 8 ch
//     azimuth: 0,
//     diverge: 0.5,
//     elevation: 0,
//     enableIsotropicEncode: true,
//     sRotation: 0,
//     sSpread: 0.5,
//     autoOrbit: true,

//     // Mach1Decode Parameters
//     decoderRotationY: 0,
//     decoderRotationP: 0,
//     decoderRotationR: 0,
//   };
// }

// export default function initializeMachService(i) {
//   /*
//     Initialize Mach1Decode Module and use some default settings
//     */
//   Mach1DecodeModule().then(function (m1DecodeModule) {
//     globalMachControls[index].m1Decode = new m1DecodeModule.Mach1Decode();
//     globalMachControls[index].m1Decode.setPlatformType(
//       globalMachControls[index].m1Decode.Mach1PlatformType.Mach1PlatformOfEasyCam
//     );
//     globalMachControls[index].m1Decode.setDecodeAlgoType(
//       globalMachControls[index].m1Decode.Mach1DecodeAlgoType.Mach1DecodeAlgoSpatial
//     );
//     globalMachControls[index].m1Decode.setFilterSpeed(0.95);
//   });

//   /*
//     Initialize Mach1Encode Module
//     */
//   Mach1EncodeModule().then(function (m1EncodeModule) {
//     globalMachControls[index].m1Encode = new m1EncodeModule.Mach1Encode();
//   });

//   const FRAMES_PER_SECOND = 60;

//   var audioFiles;

//   /*
//     Function for setting up loading for audio in path
//     currently using hardcoded example audio downloaded from
//     running `download-audiofiles.sh` or `download-audiofiles.bat`
//     */
//   function loadSound(sound, onLoad) {
//     if (globalMachControls[index].params.inputKind == 0) {
//       // Input: MONO
//       audioFiles = [sound];
//     } else if (globalMachControls[index].params.inputKind == 1) {
//       // Input: STERO
//       audioFiles = [sound, sound];
//     } else {
//       audioFiles = [sound];
//     }

//     if (globalMachControls[index].mach1SoundPlayer) {
//       globalMachControls[index].mach1SoundPlayer.remove();
//     }
//     globalMachControls[index].mach1SoundPlayer = new Mach1SoundPlayer(
//       audioFiles,
//       onLoad
//     );
//   }

//   var textlabels = [];
//   var spheres = [];
//   var lines = [];

//   function toggleInputOutputKind() {
//     if (globalMachControls[index].params.inputKind == 0) {
//       // Input: MONO
//       globalMachControls[index].m1Encode.setInputMode(
//         globalMachControls[index].m1Encode.Mach1EncodeInputModeType
//           .Mach1EncodeInputModeMono
//       );
//     }

//     if (globalMachControls[index].params.outputKind == 0) {
//       // Output: Mach1Horizon / Quad 4CH
//       globalMachControls[index].m1Encode.setOutputMode(
//         globalMachControls[index].m1Encode.Mach1EncodeOutputModeType
//           .Mach1EncodeOutputModeM1Horizon
//       );
//     }
//     if (globalMachControls[index].params.outputKind == 1) {
//       // Output: Mach1Spatial / Cuboid 8CH
//       globalMachControls[index].m1Encode.setOutputMode(
//         globalMachControls[index].m1Encode.Mach1EncodeOutputModeType
//           .Mach1EncodeOutputModeM1Spatial
//       );
//     }

//     // Resets the Decoding input when changing Encoding output between Mach1Spatial and Mach1Horizon
//     if (globalMachControls[index].params.outputKind == 0) {
//       // Output: Mach1Horizon / Quad
//       globalMachControls[index].m1Decode.setDecodeAlgoType(
//         globalMachControls[index].m1Decode.Mach1DecodeAlgoType
//           .Mach1DecodeAlgoHorizon
//       );
//     }
//     if (globalMachControls[index].params.outputKind == 1) {
//       // Output: Mach1Spatial / Cuboid
//       globalMachControls[index].m1Decode.setDecodeAlgoType(
//         globalMachControls[index].m1Decode.Mach1DecodeAlgoType
//           .Mach1DecodeAlgoSpatial
//       );
//     }

//     globalMachControls[index].m1Encode.generatePointResults();

//     // cleanup
//     for (var i = 0; i < spheres.length; i++) {
//       scene.remove(spheres[i]);
//       scene.remove(lines[i]);
//     }
//     spheres = [];
//     lines = [];

//     for (var i = 0; i < textlabels.length; i++) {
//       textlabels[i].element.parentNode.removeChild(textlabels[i].element);
//     }
//     textlabels = [];
//   }

//   // update
//   const update = () => {
//     globalMachControls[index].m1Encode.setAzimuth(
//       globalMachControls[index].params.azimuth
//     );
//     globalMachControls[index].m1Encode.setElevation(
//       globalMachControls[index].params.elevation
//     );
//     globalMachControls[index].m1Encode.setDiverge(
//       globalMachControls[index].params.diverge
//     );
//     // globalMachControls[index].m1Encode.setStereoRotate(globalMachControls[index].params.sRotation);
//     // globalMachControls[index].m1Encode.setStereoSpread(globalMachControls[index].params.sSpread);
//     globalMachControls[index].m1Encode.setAutoOrbit(
//       globalMachControls[index].params.autoOrbit
//     );
//     globalMachControls[index].m1Encode.setPannerMode(
//       globalMachControls[index].params.enableIsotropicEncode
//     );
//   };

//   function updateTimeout() {
//     if (
//       globalMachControls[index].m1Decode &&
//       globalMachControls[index].m1Encode &&
//       globalMachControls[index].mach1SoundPlayer &&
//       globalMachControls[index].mach1SoundPlayer.isReady()
//     ) {
//       update();
//       toggleInputOutputKind();
//     }
//   }

//   function __timeoutUpdateGains() {
//     if (
//       globalMachControls[index].mach1SoundPlayer &&
//       globalMachControls[index].mach1SoundPlayer.isPlaying()
//     ) {
//       globalMachControls[index].m1Encode.generatePointResults();

//       globalMachControls[index].m1Decode.beginBuffer();
//       var decoded = globalMachControls[index].m1Decode.decode(
//         globalMachControls[index].params.decoderRotationY,
//         globalMachControls[index].params.decoderRotationP,
//         globalMachControls[index].params.decoderRotationR
//       );
//       globalMachControls[index].m1Decode.endBuffer();

//       var vol = [];
//       if (globalMachControls[index].params.outputKind == 0) {
//         // Output: Mach1Horizon / Quad
//         vol = globalMachControls[index].m1Encode.getResultingCoeffsDecoded(
//           globalMachControls[index].m1Decode.Mach1DecodeAlgoType
//             .Mach1DecodeAlgoHorizon,
//           decoded
//         );
//       }
//       if (globalMachControls[index].params.outputKind == 1) {
//         // Output: Mach1Spatial / Cuboid
//         vol = globalMachControls[index].m1Encode.getResultingCoeffsDecoded(
//           globalMachControls[index].m1Decode.Mach1DecodeAlgoType
//             .Mach1DecodeAlgoSpatial,
//           decoded
//         );
//       }

//       globalMachControls[index].mach1SoundPlayer.gains = vol;
//     }
//   }

//   setInterval(updateTimeout, 100);
//   const updateInterval = setInterval(
//     __timeoutUpdateGains,
//     1000 / FRAMES_PER_SECOND
//   );

//   const resetAll = () => {
//     clearInterval(updateInterval);
//   };

//   const prepare = (sound, onLoad) => {
//     loadSound(sound, onLoad, i);
//   };

//   const play = () => {
//     globalMachControls[index].mach1SoundPlayer?.play(true);
//   };

//   const pause = () => {
//     globalMachControls[index].mach1SoundPlayer?.pause();
//   };

//   /**
//    * Set azimuth
//    * @param {0-360} azimuth
//    */
//   const setAzimuth = (azimuth) => {
//     globalMachControls[index].params.azimuth = azimuth / 360;
//   };

//   const setElevation = (elevation) => {
//     globalMachControls[index].params.elevation = elevation / 90;
//   };

//   const setGain = (gain) => {
//     if (globalMachControls[index].mach1SoundPlayer)
//       globalMachControls[index].mach1SoundPlayer.volume = gain * 5;
//   };

//   const controls = {
//     prepare,
//     play,
//     pause,
//     setAzimuth,
//     setElevation,
//     resetAll,
//     setGain,
//   };

//   globalMachControls[index].controls = controls;

//   return controls;
// }
