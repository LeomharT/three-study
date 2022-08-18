import { RefObject } from "react";
import { Scene } from "three";
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
    }

    private _OnWindowsResize = (e: UIEvent) =>
    {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight;

        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();

        this.renderer.SetRendererSize(width, height);
    };

    /** 初始化场景 */
    public InitScene = (domEl: RefObject<HTMLElement>) =>
    {
        //添加到指定DOM节点
        domEl.current?.appendChild(this.renderer.GetCanvasElement());

        this.LoopRender();
    };


    /** 循环渲染 */
    public LoopRender = (time?: number): void =>
    {
        requestAnimationFrame(this.LoopRender);

        this.controler.UpdateControler();

        this.renderer.RenderScene(this.camera.camera, this.scene);
    };
}
