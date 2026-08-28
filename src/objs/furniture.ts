import { Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Mesh3D } from 'illutions';

export type BakeMode = 'combined' | 'lightmap';

export class Furniture extends Mesh3D {
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    if (!(gltfObj.material instanceof MeshStandardMaterial)) return;

    // Create both baked-material variants
    const materialCombined = new MeshBasicMaterial({ color: 0xffffff });
    const materialLightmap = gltfObj.material;

    this.setTexture({ name: 'Furniture_Combined', material: materialCombined, slot: 'ColorMap' });
    this.setTexture({ name: 'Furniture_Diffuse', material: materialLightmap, slot: 'LightMap' });

    this.materialCombined = materialCombined;
    this.materialLightmap = materialLightmap;

    gltfObj.material = materialCombined;
    // Set the underlying GLTF object
    this.obj = gltfObj;
  }

  // Switch between combined and lightmap rendering
  public setBakeMode(mode: BakeMode): void {
    if (!this.materialCombined || !this.materialLightmap) return;

    this.obj.material = mode === 'combined' ? this.materialCombined : this.materialLightmap;
  }
}
