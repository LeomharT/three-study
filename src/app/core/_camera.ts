import { Easing, Tween } from '@tweenjs/tween.js';
import { Camera, OrthographicCamera, PerspectiveCamera } from "three";
import { getContainerSize } from "../Application";
export type CameraType = 'Perspective' | 'Orthographic';

export default class _Camera
{

    constructor()
    {
        const { width, heigh } = getContainerSize();

        this._perspectiveCamera = new PerspectiveCamera(
            90,            //视野角度
            width / heigh, //视野长宽比
            .1,            //近截面
            1000,          //远截面
        );


        this._perspectiveCamera.userData = { fovVolume: 90 };


        this._orthographicCamera = new OrthographicCamera(
            width / -2, width / 2, heigh / -2, heigh / -2, .1, 1000
        );
    }


    //透视相机
    private _perspectiveCamera: PerspectiveCamera;


    //正交相机
    private _orthographicCamera: OrthographicCamera;


    public cameraType: CameraType = 'Perspective';


    public zoomCameraView = (ev: WheelEvent): void =>
    {
        if (this.cameraType === 'Orthographic') return;

        const camera = this.activeCamera as PerspectiveCamera;

        if (ev.deltaY > 0)
        {
            if (camera.userData.fovVolume >= 120) return;
            camera.userData.fovVolume += 5;
        } else
        {
            if (camera.userData.fovVolume <= 60) return;
            camera.userData.fovVolume -= 5;
        }

        const target = { fov: camera.fov };

        new Tween(target)
            .to({ fov: camera.userData.fovVolume })
            .easing(Easing.Quadratic.Out)
            .onUpdate(() =>
            {
                camera.userData.fovVolume = target.fov;

                camera.updateProjectionMatrix();
            })
            .start();

    };


    /** 当前激活的相机 */
    get activeCamera(): Camera
    {
        if (this.cameraType === 'Orthographic') return this._orthographicCamera;
        return this._perspectiveCamera;
    }

}
