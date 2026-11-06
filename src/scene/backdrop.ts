import { Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Mesh3D } from 'illutions';

import type { MyApp } from '../index';
import type { Mode } from './furniture';

export class Backdrop extends Mesh3D {
  declare public comps: MyApp['comps'];
  
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;
  private materialRealtime: MeshStandardMaterial | null = null;

  // Called once when this object is encountered while traversing the GLTF model
  public override onCreate(obj: Mesh): void {
    if (!(obj.material instanceof MeshStandardMaterial)) return;

    // Defines the backdrop transparency mask because glTF has no separate alpha-map slot
    const textureAlpha = this.comps.texture.backdropAlpha.obj;
    // Contains the fully baked backdrop appearance for combined rendering
    const textureCombined = this.comps.texture.backdropCombined.obj;
    // Contains the baked diffuse lighting used by the lightmap material
    const textureDiffuse = this.comps.texture.backdropDiffuse.obj;

    // Create combined, lightmap, and real-time material variants
    this.materialCombined = new MeshBasicMaterial({ color: 0xffffff, transparent: true });
    this.materialRealtime = obj.material;
    this.materialLightmap = this.materialRealtime.clone();

    this.materialCombined.map = textureCombined;

    this.materialLightmap.lightMap = textureDiffuse;
    this.materialLightmap.alphaMap = textureAlpha;
    this.materialLightmap.normalMap = null;

    this.materialRealtime.alphaMap = textureAlpha;
    this.materialRealtime.normalMap = null;

    obj.material = this.materialCombined;
    obj.castShadow = false;
    obj.frustumCulled = false;
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
