import { setComps, SpotLight3D } from 'illutions';

import { Baked, BakedColor } from './textures/baked';
import { Backdrop } from './scene/backdrop';
import { Cam } from './scene/cam';
import { Furniture } from './scene/furniture';
import { Fruitbowl } from './scene/fruitbowl';
import { Toggle } from './web/toggle';

// Register customized asset components
export const comps = setComps({
  textures: {
    backdropCombined: {
      class: BakedColor,
      params: { name: 'Backdrop_Combined', gltf: true, image: true }
    },
    backdropDiffuse: {
      class: BakedColor,
      params: { name: 'Backdrop_Diffuse', gltf: true, image: true }
    },
    backdropAlpha: {
      class: Baked,
      params: { name: 'Backdrop_Alpha', gltf: true, image: true }
    },
    furnitureCombined: {
      class: BakedColor,
      params: { name: 'Furniture_Combined', gltf: true, image: true }
    },
    furnitureDiffuse: {
      class: BakedColor,
      params: { name: 'Furniture_Diffuse', gltf: true, image: true }
    },
    fruitbowlCombined: {
      class: BakedColor,
      params: { name: 'Fruitbowl_Combined', gltf: true, image: true }
    },
    fruitbowlDiffuse: {
      class: BakedColor,
      params: { name: 'Fruitbowl_Diffuse', gltf: true, image: true }
    },
  },
  scene: {
    backdrop: {
      class: Backdrop,
      params: {
        gltf: true,
        obj: {
          receiveShadow: true
        }
      }
    },
    cam: {
      class: Cam,
      params: { name: 'Camera', gltf: true }
    },
    furniture: {
      class: Furniture,
      params: {
        gltf: true,
        obj: {
          castShadow: true,
          receiveShadow: true
        }
      }
    },
    fruitbowl: {
      class: Fruitbowl,
      params: { gltf: true }
    },
    spot: {
      class: SpotLight3D,
      params: {
        gltf: true,
        obj: {
          castShadow: true,
          shadow: {
            mapSize: { width: 128, height: 128 },
            camera: { near: 0.1, far: 20 },
            bias: -0.0001,
            normalBias: 0.02
          }
        }
      }
    },
  },
  web: {
    toggle: Toggle,
  },
});
