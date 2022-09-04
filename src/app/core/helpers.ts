import { Camera, Color, PointLight, Scene, SphereBufferGeometry, WebGLRenderer } from "three";
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

        const geometry = new SphereBufferGeometry(6, 32, 32);
    };

}
