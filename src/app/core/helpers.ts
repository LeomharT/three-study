import { Camera, Color, Mesh, PointLight, Scene, ShaderMaterial, SphereBufferGeometry, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
export type LightHelperOptions = {
    color?: Color;
    size?: number;
};

export class Helpers
{
    private _scene: Scene;
    private _camera: Camera;
    private _renderer: WebGLRenderer;
    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera)
    {
        this._scene = scene;
        this._camera = camera;
        this._renderer = renderer;
    }

    addPointLightHelper = (light: PointLight, options?: LightHelperOptions) =>
    {
        const renderScene = new RenderPass(this._scene, this._camera);

        const bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0;
        bloomPass.strength = 5;
        bloomPass.radius = 0;

        const bloomComposer = new EffectComposer(this._renderer);
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

        const finalComposer = new EffectComposer(this._renderer);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);

        const geometry = new SphereBufferGeometry(6, 32, 32);

        const mesh = new Mesh(geometry, material);
        this._scene.add(mesh);
    };

}
