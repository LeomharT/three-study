import { useCallback, useEffect, useRef } from "react";
import { Euler, HemisphereLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PlaneGeometry, SpotLight, Texture, TextureLoader, Vector3 } from "three";
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { app } from "../../app/Application";
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
        spotLight.angle = Math.PI / 16;
        spotLight.penumbra = 0.5;
        spotLight.castShadow = true;
        spotLight.position.set(- 1, 1, 1);
        app.scene.add(spotLight);

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        dracoLoader.setDecoderConfig({ type: 'js' });

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        const bunny = (await gltfLoader.loadAsync('/assets/modules/bunny.gltf')).scene.children[0] as Mesh;

        bunny.castShadow = true;
        bunny.scale.set(0.2, 0.2, 0.2);



        const textureLoader = new TextureLoader();
        textureLoader.setPath('/assets/texture/stickers');

        const sticker_three = textureLoader.load('/three.png');
        const sticker_react = textureLoader.load('/react.png');
        const sticker_twemoji = textureLoader.load('/twemoji.png');
        const sticker_sticjer = textureLoader.load('/sticjer.png');

        const decal_three = new DecalGeometry(
            bunny,
            new Vector3(-0.1, 1.3, 0.55),
            new Euler(Math.PI * 1.2),
            new Vector3(0.45, 0.45, 0.45)
        );

        bunny.add(new Mesh(decal_three, createStickerMaterial(sticker_react)));

        app.scene.add(bunny);

    }, []);


    useEffect(() =>
    {
        app.enableShadow();

        initScene();

    }, [initScene]);


    return (
        <div ref={container} id='container'></div>
    );
}
