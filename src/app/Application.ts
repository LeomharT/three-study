import { update } from "@tweenjs/tween.js";
import { message } from "antd";
import { RefObject } from "react";
import { ArrowHelper, Clock, Object3D, OrthographicCamera, PerspectiveCamera, Scene, Vector3 } from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';
import _Camera from "./core/camera";
import Controler from "./core/controler";
import _Renderer from "./core/renderer";

export let app: Application;

const FRAME = 1 / 60;

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


    /** 帧数状态 */
    //@ts-ignore
    private _stats: Stats = new Stats();


    /** 控制帧数->计时器 */
    private _clock: Clock = new Clock();


    /** 控制帧数->时间差 */
    private _times: number = 0;


    /** 初始化场景 */
    public initScene = (container: RefObject<HTMLDivElement>): void =>
    {
        const camera = this.camera.activeCamera as PerspectiveCamera;

        this.renderer.setUpWebGLrenderer();

        camera.position.set(1, 1.5, 1);
        camera.lookAt(this.scene.position);
        camera.updateProjectionMatrix();

        container.current?.appendChild(this.renderer.domElement);

        window.onresize = this._onWindowsResize;
        window.onwheel = this.camera.zoomCameraView;

        this._loopRender();
    };


    /** 卸载场景 */
    public disposeScene = (): void =>
    {
        window.onresize = null;

        window.onwheel = null;

        this.renderer.fnList = [];

        this.scene.clear();

        if (document.body.contains(this._stats.dom))
        {
            document.body.removeChild(this._stats.dom);
        }
    };


    /** 限制渲染帧数 */
    private _limitFrame = (): boolean =>
    {
        const delta = this._clock.getDelta();

        this._times += delta;

        //保证一秒最高FPS60 -> 小于16毫秒不执行
        if (this._times < FRAME) return false;

        this._times = 0;

        return true;
    };


    /** 每帧更新渲染 */
    private _loopRender = (time?: number) =>
    {
        requestAnimationFrame(this._loopRender);

        const isHeightFrame = this._limitFrame();

        if (!isHeightFrame) return;

        //TWEEN
        update(time);

        //Stats
        this._stats.update();

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


    /** 添加箭头坐标助手 */
    public addArrowHelper = () =>
    {
        const arrow_helpers: Object3D[] = [
            new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 25, "#FF0000"),
            new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 25, "#00FF00"),
            new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 25, "#0000FF"),
        ];

        app.scene.add(...arrow_helpers);
    };


    /** 添加帧数显示 */
    public showStatus = () =>
    {
        const domElement = this._stats.dom;

        domElement.id = 'webgl_stats';

        domElement.style.left = '330px';

        document.body.appendChild(domElement);
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
