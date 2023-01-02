import { useCallback, useEffect, useRef } from "react";
import { Color, Euler, HemisphereLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, SpotLight, SpotLightHelper, Texture, TextureLoader, Vector3 } from "three";
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { app } from "../../app/Application";
import { pane } from "../../app/core/pane";
import useScene from "../../hooks/useScene";
import { end } from "../../util/aop";
export default function Stickers()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const createStickerMaterial = useCallback((texture: Texture) =>
    {
        const material = new MeshPhysicalMaterial({
            map: texture,
            transparent: true,
            polygonOffset: true,
            polygonOffsetFactor: -10,
            roughness: 1,
            clearcoat: 0.5,
            metalness: 0.75,
            toneMapped: false,
        });

        material.iridescence = 1;
        material.iridescenceIOR = 1;
        material.iridescenceThicknessRange = [1, 1400];

        const material_folder = pane.addFolder({ title: "material" });

        material_folder.addInput(material, 'iridescence', { min: 0, max: 1, step: 0.01 });
        material_folder.addInput(material, 'iridescenceIOR', { min: 0, max: 1, step: 0.01 });

        return material;
    }, []);


    const initScene = useCallback(async () =>
    {
        const textureLoader = new TextureLoader();


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


        textureLoader.setPath('/assets/texture/');
        const disturb = textureLoader.load('disturb.jpg');

        const spotLight = new SpotLight(0xffffff);
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        spotLight.position.set(-2, 2, 2);
        spotLight.map = disturb;
        spotLight.distance = 50;


        app.scene.add(spotLight);

        //Light Helper
        const spotLightHelper = new SpotLightHelper(spotLight);
        app.scene.add(spotLightHelper);

        //Pane Params
        const spotLightFolder = pane.addFolder({ title: "spot_light" });
        spotLightFolder.addInput(spotLight, 'intensity', { min: 0, max: 10, step: 0.01 });
        spotLightFolder.addInput(spotLight.position, 'x', { min: -10, max: 10, step: 0.01 });
        spotLightFolder.addInput(spotLight.position, 'y', { min: -10, max: 10, step: 0.01 });
        spotLightFolder.addInput(spotLight.position, 'z', { min: -10, max: 10, step: 0.01 });
        spotLightFolder.addInput(spotLight, 'angle', { min: 0, max: Math.PI / 3, step: 0.01 });
        spotLightFolder.addInput(spotLight, 'penumbra', { min: 0, max: 1, step: 0.01 });
        spotLightFolder.addInput(spotLight, 'distance', { min: 1, max: 200, step: 0.01 });
        spotLightFolder.addInput({ color: '#ffffff' }, 'color').on('change', v => spotLight.color = new Color(v.value));
        spotLightFolder.addInput({ map: 'disturb' }, 'map', {
            options: {
                none: 'none',
                disturb: 'disturb'
            }
        }).on('change', (v) =>
        {
            if (v.value === 'none') spotLight.map = null;
            if (v.value === 'disturb') spotLight.map = disturb;
        });

        spotLightFolder.addInput(spotLightHelper, 'visible');

        end(app.loopRender, () => spotLightHelper.update());

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        const bunny = (await gltfLoader.loadAsync('/assets/modules/bunny.gltf')).scene.children[0] as Mesh;

        bunny.castShadow = true;

        textureLoader.setPath('/assets/texture/stickers');

        const rgbeLoader = new RGBELoader();
        rgbeLoader.setPath('/assets/texture/');

        const texture_three = textureLoader.load('/three.png');
        const texture_react = textureLoader.load('/react.png');
        const texture_twemoji = textureLoader.load('/twemoji.png');
        const texture_sticjer = textureLoader.load('/sticjer.png');

        const decal_params = {
            x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0,
        };

        function addSticker()
        {
            bunny.remove(...bunny.children);

            const decal_three = new DecalGeometry(
                bunny,
                new Vector3(decal_params.x, decal_params.y, decal_params.z),
                new Euler(decal_params.rotationX, decal_params.rotationY, decal_params.rotationZ, 'XYZ'),
                new Vector3(decal_params.scale, decal_params.scale, decal_params.scale)
            );

            const sticker_material = createStickerMaterial(texture_react);

            const sticker_three = new Mesh(decal_three, sticker_material);

            bunny.add(sticker_three);
        }

        const folder_sticker_three = pane.addFolder({ title: "sticker_three" });
        folder_sticker_three.addInput(decal_params, 'x', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'y', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'z', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'scale', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'rotationX', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'rotationY', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.addInput(decal_params, 'rotationZ', { min: -10, max: 10, step: 0.01 }).on('change', () => addSticker());
        folder_sticker_three.hidden = true;


        const sticker_sticjer = new Mesh(
            new DecalGeometry(
                bunny,
                new Vector3(0, 0.7, 0.8),
                new Euler(),
                new Vector3(0.4, 0.4, 0.4)
            ),
            createStickerMaterial(texture_sticjer)
        );

        const sticker_three = new Mesh(
            new DecalGeometry(
                bunny,
                new Vector3(-0.43, 1.08, 0.65),
                new Euler(),
                new Vector3(0.2, 0.2, 0.2)
            ),
            createStickerMaterial(texture_three)
        );

        const sticker_react = new Mesh(
            new DecalGeometry(
                bunny,
                new Vector3(0.41, 0.77, 0.65),
                new Euler(-0.14, 0.06, 0.03),
                new Vector3(0.34, 0.34, 0.34)
            ),
            createStickerMaterial(texture_react)
        );

        const sticker_twemoji = new Mesh(
            new DecalGeometry(
                bunny,
                new Vector3(-0.05, 1.48, 0.33),
                new Euler(-1.41, -0.08, -0.16),
                new Vector3(0.35, 0.35, 0.35)
            ),
            createStickerMaterial(texture_twemoji)
        );

        bunny.scale.set(0.6, 0.6, 0.6);
        bunny.add(sticker_sticjer, sticker_three, sticker_react, sticker_twemoji);

        app.scene.add(bunny);

        dracoLoader.dispose();
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
