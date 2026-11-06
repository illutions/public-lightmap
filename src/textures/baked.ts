import { Texture as ThreeTexture, SRGBColorSpace } from 'three';
import { Texture } from 'illutions';

export class Baked extends Texture {
  protected override onCreate(texture: ThreeTexture): void {
    texture.channel = 1;
  }
}

export class BakedColor extends Baked {
  protected override onCreate(texture: ThreeTexture): void {
    super.onCreate(texture);
    texture.colorSpace = SRGBColorSpace;
  }
}
