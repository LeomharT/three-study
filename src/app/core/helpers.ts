import { Color, Mesh, MeshBasicMaterial, PointLight, SphereBufferGeometry } from "three";
import { app } from "../application-service";
import { RendererLayers } from "./renderer";
export type LightHelperOptions = {
    color?: Color;
    size?: number;
};

export class Helpers
{
    addPointLightHelper = (light: PointLight, options?: LightHelperOptions) =>
    {
        const size = options?.size ?? 8;

        const geometry = new SphereBufferGeometry(size, 32, 32);

        const color = light.color.clone();

        const mesh = new Mesh(geometry, new MeshBasicMaterial({ color }));

        mesh.position.copy(light.position.clone());

        mesh.layers.enable(RendererLayers.BLOOM_SCENE);

        app.scene.add(mesh);
    };

}
