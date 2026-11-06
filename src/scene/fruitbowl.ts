import { Mesh, MeshBasicMaterial, MeshStandardMaterial, type Object3D } from 'three';
import { Obj3D } from 'illutions';

import type { MyApp } from '../index';

import type { Mode } from './furniture';

interface PrimitiveMaterials {
  mesh: Mesh;
  combined: MeshBasicMaterial;
  lightmap: MeshStandardMaterial;
  realtime: MeshStandardMaterial;
}

export class Fruitbowl extends Obj3D {
  declare public comps: MyApp['comps'];
  
  private readonly primitives: PrimitiveMaterials[] = [];

  // Called once when this object is encountered while traversing the GLTF model
  public override onCreate(obj: Object3D): void {
    // Contains the fully baked fruit bowl appearance for combined rendering
    const textureCombined = this.comps.texture.fruitbowlCombined.obj;

    // Contains the baked diffuse lighting used by the lightmap materials
    const textureDiffuse = this.comps.texture.fruitbowlDiffuse.obj;

    // Create combined, lightmap, and real-time material variants for every fruit primitive
    obj.traverse((child) => {
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
