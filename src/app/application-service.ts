import { update } from "@tweenjs/tween.js";
import { RefObject } from "react";
import { ArrowHelper, Object3D, Scene, Vector3 } from "three";
import _Camera from "./core/camera";
import _Controler from "./core/controler";
import _Renderer from "./core/renderer";

/**
 * 主程序
 */
export let app: Application;

export class Application
{
    constructor()
    {
        app = this;

        window.onresize = this._onWindowsResize;
        window.onwheel = this.camera.onWheel;
    }
    /** 场景 -> 场景没必要封装 */
    public scene: Scene = new Scene();

    /** 相机 */
    public camera: _Camera = new _Camera(
        //视野角度,后续缩放修改这个,默认给90
        90,
        //摄像机视锥体长宽比(必须保证大于0否则看不见场景)
        document.body.clientWidth / document.body.clientHeight,
        //近截面,相机视角小于这个值不渲染
        .1,
        //远截面,相机视角大于这个值不渲染
        1000,
    );

    /** WebGLRenderer */
    public renderer: _Renderer = new _Renderer();

    /** 轨道控制器 */
    public controler: _Controler = new _Controler({ camera: this.camera, domElement: this.renderer.getCanvasElement() });

    public injectFunction: Function | null = null;

    /** 拖拽窗体时重新定义canvas大小 */
    private _onWindowsResize = (e: UIEvent) =>
    {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setRendererSize(width, height);
    };

    /** 循环渲染 */
    private _loopRender = (time?: number): void =>
    {
        requestAnimationFrame(this._loopRender);

        this.controler.updateControler();

        this.renderer.renderScene(this.camera, this.scene);

        //这里调用才会触发onUpdate
        update(time);


        if (this.injectFunction)
        {
            this.injectFunction(time);
        }
    };

    /** 初始化场景 */
    public initScene = (domEl: RefObject<HTMLElement>): void =>
    {
        this.renderer.setUpWebGLRenderer();

        this.camera.setUpCamera(this.scene);

        //添加到指定DOM节点
        domEl.current?.appendChild(this.renderer.getCanvasElement());

        this._loopRender();
    };

    /** 卸载场景 */
    public disPoseScene = (): void =>
    {
        window.onresize = null;
        window.onwheel = null;
        this.injectFunction = null;
    };

    public addArrowHelper = (): void =>
    {
        //添加箭头坐标助手
        const arrowHelpers: Object3D[] = [
            new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 250, "#FF0000"),
            new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 250, "#00FF00"),
            new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 250, "#0000FF"),
        ];

        this.scene.add(...arrowHelpers);
    };
}
