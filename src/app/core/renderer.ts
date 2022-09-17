import { Camera, Color, Layers, Material, Mesh, MeshBasicMaterial, RepeatWrapping, Scene, ShaderMaterial, TextureLoader, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import tri_pattern from '../../assets/image/tri_pattern.jpg';


export enum RendererLayers
{
    ENTIRE_SCENE = 0,
    BLOOM_SCENE = 1,
    OUTLINE_SCENE = 2,
}

export default class _Renderer
{
    private _scene: Scene;

    private _camera: Camera;

    private _bloomComposer: EffectComposer;

    private _finalComposer: EffectComposer;

    private _outlineComposer: EffectComposer;

    public outlinePass: OutlinePass;

    constructor(scene: Scene, camera: Camera)
    {
        this._scene = scene;
        this._camera = camera;

        const { bloomComposer, finalComposer } = this._initComposers();

        this._bloomComposer = bloomComposer;
        this._finalComposer = finalComposer;

        this._bloomLayer.set(RendererLayers.BLOOM_SCENE);
        this._outLineLayer.set(RendererLayers.OUTLINE_SCENE);

        const { outline_composer, outline_pass } = this._initOutlineComposer();

        this._outlineComposer = outline_composer;
        this.outlinePass = outline_pass;
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

    private _darkMaterial = new MeshBasicMaterial({ color: 'black' });

    private _bloomLayer = new Layers();

    private _outLineLayer = new Layers();

    private _materialList: { [index: string]: Material | Material[]; } = {};

    /** 设置渲染器 */
    public setUpWebGLRenderer = (): void =>
    {
        //分辨率
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);

        //想设置曝光度的话需要设置色调映射
        // this._webGLRenderer.toneMapping = ReinhardToneMapping;
        // this._webGLRenderer.toneMappingExposure = Math.pow(2, 4.0);

        //画布大小
        this.setRendererSize(document.body.clientWidth, document.body.clientHeight);
        //场景背景颜色
        this._webGLRenderer.setClearColor(new Color(0, 0, 0));
        //分辨率
        this._webGLRenderer.setPixelRatio(window.devicePixelRatio);
        //取消自动清除缓存
        this._webGLRenderer.autoClear = false;
    };

    /** 设置画布大小 */
    public setRendererSize = (width: number, height: number) =>
    {
        this._webGLRenderer.setSize(width, height);

        //设置通道大小
        this._bloomComposer.setSize(width, height);

        this._finalComposer.setSize(width, height);

        this._outlineComposer.setSize(width, height);
    };

    /** 初始化后期通道 */
    private _initComposers = (): { bloomComposer: EffectComposer; finalComposer: EffectComposer; } =>
    {
        const renderScene = new RenderPass(this._scene, this._camera);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        //辉光强度
        bloomPass.strength = 2.5;
        //模糊半径
        bloomPass.radius = 1;

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

        return { bloomComposer, finalComposer };
    };

    private _initOutlineComposer = (): { outline_composer: EffectComposer, outline_pass: OutlinePass; } =>
    {
        const outline_composer = new EffectComposer(this.webGLRenderer);

        const render_pass = new RenderPass(this._scene, this._camera);

        const outline_pass = new OutlinePass(
            new Vector2(window.innerWidth, window.innerHeight),
            this._scene, this._camera
        );

        outline_pass.visibleEdgeColor = new Color(0xffffff);
        outline_pass.hiddenEdgeColor = new Color(0xffffff);

        let effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms['resolution'].value.set(   //设置分辨率
            1 / window.innerWidth, 1 / window.innerHeight
        );

        new TextureLoader().load(tri_pattern, texture =>
        {
            outline_pass.patternTexture = texture;

            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
        });

        outline_composer.addPass(render_pass);
        outline_composer.addPass(outline_pass);
        outline_composer.addPass(effectFXAA);

        return { outline_composer, outline_pass };
    };

    private _rendererComposer = (): void =>
    {
        this._scene.traverse(obj =>
        {
            let mesh = obj as Mesh;

            if (mesh.isMesh && this._bloomLayer.test(mesh.layers) === false)
            {
                this._materialList[mesh.uuid] = mesh.material;
                mesh.material = this._darkMaterial;
            }
        });

        this._bloomComposer.render();

        this._scene.traverse(obj =>
        {
            let mesh = obj as Mesh;

            if (this._materialList[mesh.uuid])
            {
                mesh.material = this._materialList[mesh.uuid];
                delete this._materialList[mesh.uuid];
            }
        });

        this._finalComposer.render();
    };

    /**
     *  渲染场景
     *  @link https://discourse.threejs.org/t/solved-effectcomposer-layers/3158
     *  - 不使用composer渲染还是使用webGL
     *  - 保证能同时渲染多个图层
     *  - 现在想要辉光效果最好使用RGB颜色
     */
    public renderScene = (): void =>
    {
        //手动清除缓存可以同时渲染发光模型和普通模型
        this._webGLRenderer.clear();

        this._camera.layers.set(RendererLayers.OUTLINE_SCENE);
        this._outlineComposer.render();

        this._camera.layers.set(RendererLayers.BLOOM_SCENE);
        this._webGLRenderer.setClearColor(0x000000);
        this._bloomComposer.render();
        this._webGLRenderer.setClearColor(0x111418);
        this._finalComposer.render();

        this._webGLRenderer.clearDepth();
        this._camera.layers.set(RendererLayers.ENTIRE_SCENE);

        this._webGLRenderer.render(this._scene, this._camera);
    };

    /** 获取canvas元素 */
    public getCanvasElement = (): HTMLElement =>
    {
        return this._webGLRenderer.domElement;
    };
}
