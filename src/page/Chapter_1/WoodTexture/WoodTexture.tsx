import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, LinearFilter, Mesh, MeshBasicMaterial, NearestFilter, TextureLoader } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function WoodTexture()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const initScene = useCallback(() =>
    {
        const textureLoader = new TextureLoader();
        textureLoader.setPath('/assets/texture/door/');

        const doorColorTexture = textureLoader.load('minecraft.png');
        // const doorAlphaTexture = textureLoader.load('Door_Wood_001_opacity.jpg');
        // const doorNormalTexture = textureLoader.load('Door_Wood_001_normal.jpg');
        // const doorRoughnessTexture = textureLoader.load('Door_Wood_001_roughness.jpg');
        // const doorMetallicTexture = textureLoader.load('Door_Wood_001_metallic');
        // const doorAmbientOcclusionTexture = textureLoader.load('Door_Wood_001_ambientOcclusion.');
        // const doorHeightTexture = textureLoader.load('Door_Wood_001_height');


        /**
         * Repeating
         */
        // doorColorTexture.wrapS = MirroredRepeatWrapping;
        // doorColorTexture.wrapT = MirroredRepeatWrapping;
        // doorColorTexture.repeat.x = 2;
        // doorColorTexture.repeat.y = 2;

        /**
         * Rotations
         */
        // doorColorTexture.rotation = -45 * MathUtils.DEG2RAD;
        // doorColorTexture.center.x = 0.5;
        // doorColorTexture.center.y = 0.5;

        /**
         * Offect
         */
        // doorColorTexture.offset.x = 0.2;

        /**
         * 贴图缩小后的效果
         */
        doorColorTexture.minFilter = LinearFilter;

        /**
         * 材质放大的效果
         */
        doorColorTexture.magFilter = NearestFilter;


        const geometry = new BoxGeometry(1, 1, 1);

        const material = new MeshBasicMaterial({
            transparent: true,
            map: doorColorTexture,
        });

        const cube = new Mesh(geometry, material);

        app.scene.add(cube);

    }, []);


    useEffect(() =>
    {
        app.showStatus();

        initScene();
    }, [initScene]);


    return (
        <div ref={container} id='container'>
        </div>
    );
}
