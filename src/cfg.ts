import { cfg } from 'illutions';

// Display runtime information and editable settings
cfg.gui.infoBox.enable = true;
cfg.gui.inspector.enable = true;

// Load orbit controls
cfg.orbitCtrls.load = true;
cfg.orbitCtrls.autoRotate = true;
cfg.orbitCtrls.autoRotateSpeed = 0.2;
cfg.orbitCtrls.rotateSpeed = 0.25;
cfg.orbitCtrls.enablePan = false;
cfg.orbitCtrls.enableDamping = true;
cfg.orbitCtrls.dampingFactor = 0.05;
cfg.orbitCtrls.maxPolarAngle = 170;
cfg.orbitCtrls.maxDistance = 15;
cfg.orbitCtrls.minDistance = 4;

// Load the current Draco-compressed 3D scene
cfg.model.file = ['scene/lightmap-low.glb', 'scene/lightmap-med.glb', 'scene/lightmap-high.glb'];
cfg.model.compress.mesh = 'draco';

// Light the scene with an external EXR environment
cfg.envCtrls.enable = true;
cfg.envCtrls.map = ['scene/lonely_road_afternoon_puresky_256.exr'];
cfg.envCtrls.dataType = 'float';
cfg.envCtrls.environmentIntensity = 0.3;
cfg.envCtrls.backgroundIntensity = 0;
cfg.envCtrls.rotation.y = 310;

// Configure post-processing
cfg.post.aa.mode = 'traa'
cfg.post.webgl.aa.fxaa.sharpness = 1;

cfg.debug.log = 'all'

export { cfg };
