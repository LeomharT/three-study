import { Color, Mesh, MeshBasicMaterial, PointLight, SphereBufferGeometry } from "three";
import { app } from "../application-service";
import { RendererLayers } from "./renderer";
export type LightHelperOptions = {
    color?: Color;
};

export class Helpers
{
    private _pointLightHelperMesh = new Mesh(
        new SphereBufferGeometry(20, 12, 12),
        new MeshBasicMaterial()
    );

    addPointLightHelper = (light: PointLight, options?: LightHelperOptions) =>
    {
        const color = light.color.clone();

        const mesh = this._pointLightHelperMesh;

        mesh.material.color = color;

        mesh.position.copy(light.position.clone());

        mesh.layers.enable(RendererLayers.BLOOM_SCENE);

        app.scene.add(mesh);
    };

}
