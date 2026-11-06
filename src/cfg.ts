import { setCfg, degToRad } from 'illutions';

export const cfg = setCfg({
  // Display runtime information and editable settings
  gui: {
    infoBox: {
      enable: true,
    },
    inspector: {
      enable: true,
    },
  },

  // Load the current Draco-compressed 3D scene
  model: {
    file: ['scene/lightmap-low.glb', 'scene/lightmap-med.glb', 'scene/lightmap-high.glb'],
    compress: {
      mesh: 'draco',
    },
  },

  // Light the scene with an external EXR environment
  envCtrls: {
    enable: true,
    map: ['scene/lonely_road_afternoon_puresky_256.exr'],
    dataType: 'float',
    environmentIntensity: 0.3,
    backgroundIntensity: 0,
    rotation: {
      y: degToRad(310),
    },
  },

  // Load orbit controls
  orbitCtrls: {
    load: true,
    autoRotate: true,
    autoRotateSpeed: 0.2,
    rotateSpeed: 0.25,
    enablePan: false,
    enableDamping: true,
    dampingFactor: 0.05,
    maxPolarAngle: degToRad(170),
    maxDistance: 15,
    minDistance: 4,
  },

  render: {
    // Configure renderer profiles
    profile: {
      webgpu: {
        msaa: 'render',
        aa: 'traa',
      },
      webgl: {
        msaa: 'post',
        aa: 'fxaa',
      },
    },
  },

  // Configure post-processing
  post: {
    webgl: {
      aa: {
        fxaa: {
          sharpness: 1,
        },
      },
    },
  },

  // Log all messages to the console.
  debug: {
    log: 'all',
  },
});
