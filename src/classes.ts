import { Toggle } from './comps/toggle';
import { Backdrop } from './objs/backdrop';
import { Camera } from './objs/camera';
import { Furniture } from './objs/furniture';
import { Fruitbowl } from './objs/fruitbowl';
import { Spot } from './objs/spot';

export const classes = {
  // Register customized web components
  comps: {
    Toggle,
  },
  // Register the customized 3D objects
  objs3D: {
    Backdrop,
    Camera,
    Furniture,
    Fruitbowl,
    Spot,
  },
};
