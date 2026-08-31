import { Mesh, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace } from 'three';
import { Mesh3D } from 'illutions';

export type Mode = 'combined' | 'lightmap' | 'realtime';

export class Furniture extends Mesh3D {
  private materialCombined: MeshBasicMaterial | null = null;
  private materialLightmap: MeshStandardMaterial | null = null;
  private materialRealtime: MeshStandardMaterial | null = null;

  // Called once before the GLTF model starts loading to request image textures from unused GLTF images
  protected override onStart(): void {
    this.requestImageTexture('Furniture_Combined');
    this.requestImageTexture('Furniture_Diffuse');
  }

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    if (!(gltfObj.material instanceof MeshStandardMaterial)) return;

    // Contains the fully baked furniture appearance for combined rendering
    const textureCombined = this.getImageTexture('Furniture_Combined');
    textureCombined.channel = 1;
    textureCombined.colorSpace = SRGBColorSpace;

    // Contains the baked diffuse lighting used by the lightmap material
    const textureDiffuse = this.getImageTexture('Furniture_Diffuse');
    textureDiffuse.channel = 1;
    textureDiffuse.colorSpace = SRGBColorSpace;

    // Create combined, lightmap, and real-time material variants
    this.materialCombined = new MeshBasicMaterial({ color: 0xffffff });
    this.materialRealtime = gltfObj.material;
    this.materialLightmap = this.materialRealtime.clone();

    this.materialCombined.map = textureCombined;
    this.materialLightmap.lightMap = textureDiffuse;

    gltfObj.material = this.materialCombined;
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
