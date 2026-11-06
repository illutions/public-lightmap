import { Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Mesh3D } from 'illutions';
import type { MyApp } from '../index';

export type Mode = 'combined' | 'lightmap' | 'realtime';

export class Furniture extends Mesh3D {
  declare public comps: MyApp['comps'];
  
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;
  private materialRealtime: MeshStandardMaterial | null = null;

  // Called once when this object is encountered while traversing the GLTF model
  public override onCreate(obj: Mesh): void {
    if (!(obj.material instanceof MeshStandardMaterial)) return;

    // Contains the fully baked furniture appearance for combined rendering
    const textureCombined = this.comps.texture.furnitureCombined.obj;

    // Contains the baked diffuse lighting used by the lightmap material
    const textureDiffuse = this.comps.texture.furnitureDiffuse.obj;

    // Create combined, lightmap, and real-time material variants
    this.materialCombined = new MeshBasicMaterial({ color: 0xffffff });
    this.materialRealtime = obj.material;
    this.materialLightmap = this.materialRealtime.clone();

    this.materialCombined.map = textureCombined;
    this.materialLightmap.lightMap = textureDiffuse;

    obj.material = this.materialCombined;
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
