import { Mesh, MeshBasicMaterial, MeshStandardMaterial, SRGBColorSpace } from 'three';
import { Mesh3D } from 'illutions';

import type { Mode } from './furniture';

interface PrimitiveMaterials {
  mesh: Mesh;
  combined: MeshBasicMaterial;
  lightmap: MeshStandardMaterial;
  realtime: MeshStandardMaterial;
}

export class Fruitbowl extends Mesh3D {
  private readonly primitives: PrimitiveMaterials[] = [];

  // Called once before the GLTF model starts loading to request image textures from unused GLTF images
  protected override onStart(): void {
    this.requestImageTexture('Fruitbowl_Combined');
    this.requestImageTexture('Fruitbowl_Diffuse');
  }

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    // Contains the fully baked fruit bowl appearance for combined rendering
    const textureCombined = this.getImageTexture('Fruitbowl_Combined');
    textureCombined.channel = 1;
    textureCombined.colorSpace = SRGBColorSpace;

    // Contains the baked diffuse lighting used by the lightmap materials
    const textureDiffuse = this.getImageTexture('Fruitbowl_Diffuse');
    textureDiffuse.channel = 1;
    textureDiffuse.colorSpace = SRGBColorSpace;

    // Create combined, lightmap, and real-time material variants for every fruit primitive
    gltfObj.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      if (!(child.material instanceof MeshStandardMaterial)) return;

      const primitive: PrimitiveMaterials = {
        mesh: child,
        combined: new MeshBasicMaterial({ color: 0xffffff }),
        lightmap: child.material.clone(),
        realtime: child.material
      };

      primitive.combined.map = textureCombined;
      primitive.lightmap.lightMap = textureDiffuse;

      this.primitives.push(primitive);
      child.material = primitive.combined;
    });

    // Set the underlying GLTF object
    this.obj = gltfObj;
  }

  // Switch every primitive between combined, lightmap, and real-time rendering
  public setMode(mode: Mode): void {
    for (const primitive of this.primitives) {
      switch (mode) {
        case 'combined':
          primitive.mesh.material = primitive.combined;
          break;
        case 'lightmap':
          primitive.mesh.material = primitive.lightmap;
          break;
        case 'realtime':
          primitive.mesh.material = primitive.realtime;
          break;
      }
    }
  }
}
