import { Mesh, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace } from 'three';
import { Mesh3D } from 'illutions';

import type { Mode } from './furniture';

export class Backdrop extends Mesh3D {
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;
  private materialRealtime: MeshStandardMaterial | null = null;

  // Called once before the GLTF model starts loading to request image textures from unused GLTF images
  protected override onStart(): void {
    this.requestImageTexture('Backdrop_Combined');
    this.requestImageTexture('Backdrop_Diffuse');
    this.requestImageTexture('Backdrop_Alpha');
  }

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    if (!(gltfObj.material instanceof MeshStandardMaterial)) return;

    // Defines the backdrop transparency mask because glTF has no separate alpha-map slot
    const textureAlpha = this.getImageTexture('Backdrop_Alpha');

    // Contains the fully baked backdrop appearance for combined rendering
    const textureCombined = this.getImageTexture('Backdrop_Combined');
    textureCombined.channel = 1;
    textureCombined.colorSpace = SRGBColorSpace;

    // Contains the baked diffuse lighting used by the lightmap material
    const textureDiffuse = this.getImageTexture('Backdrop_Diffuse');
    textureDiffuse.channel = 1;
    textureDiffuse.colorSpace = SRGBColorSpace;

    // Create combined, lightmap, and real-time material variants
    this.materialCombined = new MeshBasicMaterial({ color: 0xffffff, transparent: true });
    this.materialRealtime = gltfObj.material;
    this.materialLightmap = this.materialRealtime.clone();

    this.materialCombined.map = textureCombined;

    this.materialLightmap.lightMap = textureDiffuse;
    this.materialLightmap.alphaMap = textureAlpha;
    this.materialLightmap.normalMap = null;

    this.materialRealtime.alphaMap = textureAlpha;
    this.materialRealtime.normalMap = null;

    gltfObj.material = this.materialCombined;
    gltfObj.castShadow = false;
    gltfObj.frustumCulled = false;

    // Set the underlying GLTF object
    this.obj = gltfObj;
  }

  // Switch between combined, lightmap, and real-time rendering
  public setMode(mode: Mode): void {
    if (!this.materialCombined || !this.materialLightmap || !this.materialRealtime) return;

    switch (mode) {
      case 'combined':
        this.obj.material = this.materialCombined;
        break;
      case 'lightmap':
        this.obj.material = this.materialLightmap;
        break;
      case 'realtime':
        this.obj.material = this.materialRealtime;
        break;
    }
  }
}
