import { Cam3D } from 'illutions';

export class Camera extends Cam3D {
  // Called once after the GLTF model has been loaded and traversed
  protected override onReady(): void {
    // Aim the camera at the initial scene target
    const target = this.scene.getObjectByName('Aim');
    if (!target) return;

    target.getWorldPosition(this.objTarget.position);
    this.obj.lookAt(this.objTarget.position);
    this.obj.updateMatrixWorld(true);
  }
}
