import { Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
import { Mesh3D } from 'illutions';

import type { BakeMode } from './furniture';

interface PrimitiveMaterials {
  mesh: Mesh;
  combined: MeshBasicMaterial;
  lightmap: MeshStandardMaterial;
}

export class Fruitbowl extends Mesh3D {
  private readonly primitives: PrimitiveMaterials[] = [];

  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(gltfObj: Mesh): void {
    // Create both baked-material variants for every fruit primitive
    gltfObj.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      if (!(child.material instanceof MeshStandardMaterial)) return;

      const materialCombined = new MeshBasicMaterial({ color: 0xffffff });
      const materialLightmap = child.material;

      this.setTexture({ name: 'Fruitbowl_Combined', material: materialCombined, slot: 'ColorMap' });
      this.setTexture({ name: 'Fruitbowl_Diffuse', material: materialLightmap, slot: 'LightMap' });

      this.primitives.push({ mesh: child, combined: materialCombined, lightmap: materialLightmap });
      child.material = materialCombined;
    });

    // Set the underlying GLTF object
    this.obj = gltfObj;
  }

  // Switch every primitive between combined and lightmap rendering
  public setBakeMode(mode: BakeMode): void {
    for (const primitive of this.primitives) {
      primitive.mesh.material = mode === 'combined' ? primitive.combined : primitive.lightmap;
    }
  }
}
