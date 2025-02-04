import * as THREE from "three";
import { System } from "ecsy";
import {
  Rotating,
  Ball,
  Cleared,
  Active,
  Target,
  Object3DComponent
} from "../Components/components.js";

// Aux position
var worldPos = new THREE.Vector3();

/**
 * Check if the [Active Ball] collides with the [Target] entities
 */
export class TargetSystem extends System {
  init() {
    this.world.registerComponent(Rotating).registerComponent(Cleared);
  }

  execute() {
    var balls = this.queries.balls.results;
    var targets = this.queries.targets.results;

    for (let i = 0; i < targets.length; i++) {
      var target = targets[i];
      var Object3DComponent = target.getObject3D();
      let targetObject = Object3DComponent.children[0];
      targetObject.getWorldPosition(worldPos);
      if (!targetObject.geometry.boundingSphere) {
        targetObject.geometry.computeBoundingSphere();
      }

      let radiusBall = targetObject.geometry.boundingSphere.radius;

      for (let i = 0; i < balls.length; i++) {
        var ball = balls[i];
        var ballObject = ball.getObject3D();
        if (!ballObject.geometry.boundingSphere) {
          ballObject.geometry.computeBoundingSphere();
        }
        let radiusBox = ballObject.geometry.boundingSphere.radius;
        let radiusSum = radiusBox + radiusBall;

        if (
          ballObject.position.distanceToSquared(worldPos) <=
          radiusSum * radiusSum
        ) {
          ball.removeComponent(Active);
          target.addComponent(Rotating, { speed: new THREE.Vector3(0, 30, 0) });
          target.addComponent(Cleared);
        }
      }
    }
  }
}

TargetSystem.queries = {
  targets: { components: [Target, Object3DComponent] },
  balls: { components: [Ball, Active, Object3DComponent] }
};
