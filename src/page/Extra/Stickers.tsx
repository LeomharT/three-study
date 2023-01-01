import { useCallback, useEffect, useRef } from "react";
import { Euler, HemisphereLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, SpotLight, Texture, TextureLoader, Vector3 } from "three";
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { app } from "../../app/Application";
import { pane } from "../../app/core/pane";
import useScene from "../../hooks/useScene";
export default function Stickers()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const createStickerMaterial = useCallback((texture: Texture) =>
    {
        return new MeshPhysicalMaterial({
            map: texture,
            transparent: true,
            polygonOffset: true,
            polygonOffsetFactor: -10,
            roughness: 1,
            clearcoat: 0.5,
            metalness: 0.75,
            toneMapped: false,
        });
    }, []);


    const initScene = useCallback(async () =>
    {
        const plane = new Mesh(
            new PlaneGeometry(8, 8),
            new MeshPhongMaterial({ color: 0x999999, specular: 0x101010 })
        );
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = 0.03;
        plane.receiveShadow = true;
        app.scene.add(plane);

        // Lights
        const hemiLight = new HemisphereLight(0x443333, 0x111122);
        app.scene.add(hemiLight);

        const spotLight = new SpotLight();
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        spotLight.position.set(-2, 2, 2);
        app.scene.add(spotLight);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        const bunny = (await gltfLoader.loadAsync('/assets/modules/bunny.gltf')).scene.children[0] as Mesh;

        bunny.castShadow = true;

        const textureLoader = new TextureLoader();
        textureLoader.setPath('/assets/texture/stickers');

        const rgbeLoader = new RGBELoader();
        rgbeLoader.setPath('/assets/texture/');

        const texture_three = textureLoader.load('/three.png');
        const texture_react = textureLoader.load('/react.png');
        const texture_twemoji = textureLoader.load('/twemoji.png');
        const texture_sticjer = textureLoader.load('/sticjer.png');

        const decal_params = {
            x: 0, y: 0.3, z: 0.8
        };

        function addSticker()
        {
            bunny.remove(...bunny.children);

            const decal_three = new DecalGeometry(
                bunny,
                new Vector3(decal_params.x, decal_params.y, decal_params.z),
                new Euler(Math.PI * 1.2),
                new Vector3(0.2, 0.2, 0.2)
            );

            const sticker_material = createStickerMaterial(texture_sticjer);
            sticker_material.iridescence = 1;
            sticker_material.iridescenceIOR = 1;
            sticker_material.iridescenceThicknessRange = [0, 1400];

            const sticker_three = new Mesh(decal_three, sticker_material);

            bunny.add(sticker_three);
        }

        addSticker();

        const folder_sticker_three = pane.addFolder({ title: "sticker_three" });
        folder_sticker_three.addInput(decal_params, 'x', { min: -2, max: 10, step: 0.001 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'y', { min: -2, max: 10, step: 0.001 }).on('change', () => addSticker());;
        folder_sticker_three.addInput(decal_params, 'z', { min: -2, max: 10, step: 0.001 }).on('change', () => addSticker());;

        app.scene.add(bunny);

    }, []);


    useEffect(() =>
    {
        app.enableShadow();

        app.addArrowHelper();

        initScene();

    }, [initScene]);


    return (
        <div ref={container} id='container'></div>
    );
}
