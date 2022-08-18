import { Easing, Tween } from "@tweenjs/tween.js";
import { PerspectiveCamera, Scene } from "three";

export default class _Camera
{
    constructor(scene: Scene)
    {
        this._SetUpCamera(scene);
    }

    private _camera: PerspectiveCamera = new PerspectiveCamera(
        //视野角度,后续缩放修改这个,默认给90
        90,
        //摄像机视锥体长宽比(必须保证大于0否则看不见场景)
        document.body.clientWidth / document.body.clientHeight,
        //近截面,相机视角小于这个值不渲染
        .1,
        //远截面,相机视角大于这个值不渲染
        1000,
    );

    private _SetUpCamera = (scene: Scene) =>
    {
        //设置相机初始视角和位置
        this.camera.position.set(300, 150, 300);
        this.camera.lookAt(scene.position);
        this.camera.updateProjectionMatrix();

        this._camera.userData = {
            fovVolume: this._camera.fov
        };
    };

    public OnWheel = (ev: WheelEvent) =>
    {
        if (ev.deltaY > 0)
        {
            if (this._camera.userData.fovVolume >= 120) return;
            this._camera.userData.fovVolume += 5;
        } else
        {
            if (this._camera.userData.fovVolume <= 60) return;
            this._camera.userData.fovVolume -= 5;
        }

        const target = { fov: this.camera.fov };

        new Tween(target)
            .to({ fov: this._camera.userData.fovVolume })
            .easing(Easing.Quadratic.Out)
            .onUpdate(() =>
            {
                this.camera.fov = target.fov;

                this.camera.updateProjectionMatrix();
            })
            .start();
    };

    get camera(): PerspectiveCamera
    {
        return this._camera;
    }
}
