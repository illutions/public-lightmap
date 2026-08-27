import { Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Mesh3D } from 'illutions';

import type { BakeMode } from './furniture';

export class Backdrop extends Mesh3D {
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    if (!(gltfObj.material instanceof MeshStandardMaterial)) return;

    // Create and register both baked-material variants
    const materialCombined = new MeshBasicMaterial({ color: 0xffffff, transparent: true });
    const materialLightmap = gltfObj.material.clone();

    this.setTexture({ name: 'Backdrop_Combined', material: materialCombined, slot: 'ColorMap' });
    this.setTexture({ name: 'Backdrop_Diffuse', material: materialLightmap, slot: 'LightMap' });
    this.setTexture({ name: 'Backdrop_Alpha', material: materialLightmap, slot: 'AlphaMap' });

    this.materialCombined = materialCombined;
    this.materialLightmap = materialLightmap;

    gltfObj.material = materialCombined;
    gltfObj.frustumCulled = false;

    // Set the underlying GLTF object
    this.obj = gltfObj;
  }

  // Switch between combined and lightmap rendering
  public setBakeMode(mode: BakeMode): void {
    if (!this.materialCombined || !this.materialLightmap) return;

    this.obj.material = mode === 'combined' ? this.materialCombined : this.materialLightmap;
  }
}
