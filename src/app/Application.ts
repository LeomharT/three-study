import { update } from "@tweenjs/tween.js";
import { message } from "antd";
import { RefObject } from "react";
import { OrthographicCamera, PerspectiveCamera, Scene } from "three";
import _Camera from "./core/camera";
import Controler from "./core/controler";
import _Renderer from "./core/renderer";

export let app: Application;

export class Application
{
    constructor()
    {
        app = this;
    }
    /** 相机 */
    public camera: _Camera = new _Camera();


    /** 场景 */
    public scene: Scene = new Scene();


    /** WebGLRenderer */
    public renderer: _Renderer = new _Renderer(this.scene, this.camera.activeCamera);


    /** 轨道控制器 */
    public controler: Controler = new Controler({ camera: this.camera.activeCamera, domElement: this.renderer.domElement });


    /** 初始化场景 */
    public initScene = (container: RefObject<HTMLDivElement>): void =>
    {
        const camera = this.camera.activeCamera as PerspectiveCamera;

        this.renderer.setUpWebGLrenderer();

        camera.position.set(100, 150, 100);
        camera.lookAt(this.scene.position);
        camera.updateProjectionMatrix();

        container.current?.appendChild(this.renderer.domElement);

        window.onresize = this._onWindowsResize;
        window.onwheel = this.camera.zoomCameraView;

        this._loopRender();
    };


    /** 卸载场景 */
    public disposeScene = () =>
    {
        window.onresize = null;
        window.onwheel = null;
        this.renderer.fnList = [];
    };


    /** 每帧更新渲染 */
    private _loopRender = (time?: number) =>
    {
        requestAnimationFrame(this._loopRender);

        //TWEEN
        update(time);

        //轨道控制器更新
        this.controler.updateControler();

        this.renderer.renderScene();

        if (this.renderer.fnList.length === 0) return;

        for (const f of this.renderer.fnList)
        {
            f.call(this);
        }
    };


    /** 更新画布尺寸 */
    private _onWindowsResize = () =>
    {
        const camera = this.camera.activeCamera as PerspectiveCamera | OrthographicCamera;

        const { width, height } = getContainerSize();

        this.renderer.setRendererSize(width, height);

        if (camera instanceof OrthographicCamera) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
}

export const getContainerSize = (): { width: number, height: number; } =>
{
    const container = document.querySelector('#container');

    if (!container)
    {
        message.error("没有加载出容器,请刷新重试");
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight,
        };;
    }

    return {
        width: container.clientWidth,
        height: container.clientHeight,
    };
};
