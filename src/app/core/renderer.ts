import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three";



export default class _Renderer
{
    /** WebGLRenderer 渲染器 */
    private _webGLRenderer: WebGLRenderer = new WebGLRenderer({
        antialias: true,             //->抗锯齿
        preserveDrawingBuffer: true, //->允许根据当前canvas生成快照
    });

    get webGLRenderer()
    {
        return this._webGLRenderer;
    }

    /** 设置渲染器 */
    public setUpWebGLRenderer = (): void =>
    {
        //分辨率
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);

        //画布大小
        this.setRendererSize(document.body.clientWidth, document.body.clientHeight);
        //场景背景颜色
        this._webGLRenderer.setClearColor(new Color(0, 0, 0));
        //分辨率
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);
    };

    /** 设置画布大小 */
    public setRendererSize = (width: number, height: number) =>
    {
        this._webGLRenderer.setSize(width, height);
    };

    /** 渲染场景 */
    public renderScene = (camera: PerspectiveCamera, scene: Scene): void =>
    {
        this._webGLRenderer.render(scene, camera);
    };

    /** 获取canvas元素 */
    public getCanvasElement = (): HTMLElement =>
    {
        return this._webGLRenderer.domElement;
    };
}
