import { Easing, Tween } from "@tweenjs/tween.js";
import { PerspectiveCamera, Scene } from "three";

export default class _Camera extends PerspectiveCamera
{
    public setUpCamera = (scene: Scene) =>
    {
        //设置相机初始视角和位置
        this.position.set(300, 150, 300);
        this.lookAt(scene.position);
        this.updateProjectionMatrix();

        this.userData = {
            fovVolume: this.fov
        };
    };

    public onWheel = (ev: WheelEvent) =>
    {
        if (ev.deltaY > 0)
        {
            if (this.userData.fovVolume >= 120) return;
            this.userData.fovVolume += 5;
        } else
        {
            if (this.userData.fovVolume <= 60) return;
            this.userData.fovVolume -= 5;
        }

        const target = { fov: this.fov };

        new Tween(target)
            .to({ fov: this.userData.fovVolume })
            .easing(Easing.Quadratic.Out)
            .onUpdate(() =>
            {
                this.fov = target.fov;

                this.updateProjectionMatrix();
            })
            .start();
    };
}
