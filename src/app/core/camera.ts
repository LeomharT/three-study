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
    };

    get camera(): PerspectiveCamera
    {
        return this._camera;
    }
}
