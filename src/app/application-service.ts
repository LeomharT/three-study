import { update } from "@tweenjs/tween.js";
import { RefObject } from "react";
import { ArrowHelper, Object3D, Scene, Vector3 } from "three";
import _Camera from "./core/camera";
import _Controler from "./core/controler";
import _Renderer from "./core/renderer";

/**
 * 主程序
 */
export class ApplicationService
{
    constructor(

        /** 场景 -> 场景没必要封装 */
        public scene: Scene = new Scene(),

        /** 相机 */
        public camera: _Camera = new _Camera(scene),

        /** WebGLRenderer */
        public renderer: _Renderer = new _Renderer(),

        /** 轨道控制器 */
        public controler: _Controler = new _Controler({ camera: camera.camera, domElement: renderer.GetCanvasElement() })
    )
    {
        window.onresize = this._OnWindowsResize;
        window.onwheel = this.camera.OnWheel;
    }

    /** 拖拽窗体时重新定义canvas大小 */
    private _OnWindowsResize = (e: UIEvent) =>
    {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();

        this.renderer.SetRendererSize(width, height);
    };

    /** 循环渲染 */
    public LoopRender = (time?: number): void =>
    {
        requestAnimationFrame(this.LoopRender);

        this.controler.UpdateControler();

        this.renderer.RenderScene(this.camera.camera, this.scene);

        //这里调用才会触发onUpdate
        update(time);
    };

    /** 初始化场景 */
    public InitScene = (domEl: RefObject<HTMLElement>): void =>
    {
        //添加箭头坐标助手
        const arrowHelpers: Object3D[] = [
            new ArrowHelper(new Vector3(1, 0, 0), new Vector3(0, 0, 0), 250, "#FF0000"),
            new ArrowHelper(new Vector3(0, 1, 0), new Vector3(0, 0, 0), 250, "#00FF00"),
            new ArrowHelper(new Vector3(0, 0, 1), new Vector3(0, 0, 0), 250, "#0000FF"),
        ];

        this.scene.add(...arrowHelpers);

        //添加到指定DOM节点
        domEl.current?.appendChild(this.renderer.GetCanvasElement());

        this.LoopRender();
    };

    /** 卸载场景 */
    public DisPoseScene = (): void =>
    {
        window.onresize = null;
        window.onwheel = null;
    };
}
