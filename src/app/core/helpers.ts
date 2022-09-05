import { Camera, Color, Mesh, MeshBasicMaterial, PointLight, Scene, SphereBufferGeometry, WebGLRenderer } from "three";
import { app } from "../application-service";
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
        const geometry = new SphereBufferGeometry(20, 32, 32);

        const color = new Color();

        color.setHSL(0.7, .8, 0.5);
        // color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05);

        const mesh = new Mesh(geometry, new MeshBasicMaterial({ color }));

        // mesh.layers.enable(RendererLayers.BLOOM_SCENE);

        app.scene.add(mesh);
    };

}
