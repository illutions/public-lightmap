import { SpotLight } from 'three';
import { Light3D } from 'illutions';

export class Spot extends Light3D {
  // Called once when this object is encountered while traversing the GLTF model
  public override onTraverse(objGltf: SpotLight): void {
    // Enable a soft, low-resolution shadow for the GLTF spotlight
    objGltf.castShadow = true;
    objGltf.shadow.mapSize.set(128, 128);
    objGltf.shadow.camera.near = 0.1;
    objGltf.shadow.camera.far = 20;
    objGltf.shadow.bias = -0.0001;
    objGltf.shadow.normalBias = 0.02;
    // Set the underlying GLTF object
    this.obj = objGltf;
  }
}
