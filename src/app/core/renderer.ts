import { Camera, Color, Layers, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

export default class _Renderer
{
    private _scene: Scene;
    private _camera: Camera;
    constructor(scene: Scene, camera: Camera)
    {
        this._scene = scene;
        this._camera = camera;
    }
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

    /** 设置辉光效果通道 */
    public addUrealEffect = () =>
    {
        const bloom_layer = new Layers();
        bloom_layer.set(1);

        const renderScene = new RenderPass(this._scene, this._camera);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 5;
        bloomPass.radius = 0;

        const bloomComposer = new EffectComposer(this._webGLRenderer);
        bloomComposer.renderToScreen = false;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const material = new ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: `
                varying vec2 vUv;

                void main()
                {
                    vUv = uv;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }
            `,
            fragmentShader: `
                uniform sampler2D baseTexture;
                uniform sampler2D bloomTexture;

                varying vec2 vUv;

                void main() {

                    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

                }
            `,
            defines: {},
        });

        const finalPass = new ShaderPass(material, 'baseTexture');
        finalPass.needsSwap = true;

        const finalComposer = new EffectComposer(this._webGLRenderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);
    };

    /** 渲染场景 */
    public renderScene = (): void =>
    {
        this._webGLRenderer.render(this._scene, this._camera);
    };

    /** 获取canvas元素 */
    public getCanvasElement = (): HTMLElement =>
    {
        return this._webGLRenderer.domElement;
    };
}
