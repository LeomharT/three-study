import { Camera, Color, ColorRepresentation, Scene, WebGLRenderer } from "three";
import { getContainerSize } from "../Application";

export default class _Renderer
{
    constructor(scene: Scene, camera: Camera)
    {
        this._scene = scene;
        this._camera = camera;
    }

    private _scene: Scene;


    private _camera: Camera;


    private _webGLRenderer: WebGLRenderer = new WebGLRenderer({
        antialias: true,             //->抗锯齿
        preserveDrawingBuffer: true, //->允许根据当前canvas生成快照
    });


    /** 渲染时注入的函数 */
    public fnList: Function[] = [];


    get domElement()
    {
        return this._webGLRenderer.domElement;
    }


    get webGLRenderer()
    {
        return this._webGLRenderer;
    }


    public setUpWebGLrenderer = (): void =>
    {
        //分辨率
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);

        const { width, height } = getContainerSize();

        this.setRendererSize(width, height);

        //场景背景颜色
        this._webGLRenderer.setClearColor(new Color(0, 0, 0));
    };


    public setRendererSize = (width: number, height: number) =>
    {
        this._webGLRenderer.setSize(width, height);
    };


    public renderScene = () =>
    {
        this._webGLRenderer.render(this._scene, this._camera);
    };


    public setClearColor = (color: ColorRepresentation) =>
    {
        this._webGLRenderer.setClearColor(color);
    };


    public clearRendererDepth = () => this._webGLRenderer.clearDepth();
}
