import { RefObject, useCallback, useEffect, useRef } from "react";
import { AmbientLight, Color, DirectionalLight, Mesh, MeshStandardMaterial } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { app } from "../app/application-service";
import useScene from "../hooks/useScene";
export default function Navigation()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    const addLigth: () => void = useCallback(() =>
    {
        app.scene.background = new Color(0xE8E8E8);

        const direc_light = new DirectionalLight(0xffffff);
        direc_light.position.set(10, 10, -10);
        direc_light.intensity = 1.5;
        app.scene.add(direc_light);

        const ambient_light = new AmbientLight(0x003973);
        ambient_light.intensity = 1.5;
        app.scene.add(ambient_light);
    }, []);

    const createText: (content: string) => Promise<Mesh> = useCallback(async (content: string): Promise<Mesh> =>
    {
        const h_regular = '/data/helvetiker_regular.typeface.json';

        const font = await new FontLoader().loadAsync(h_regular);

        const text = new TextGeometry(content, {
            font,
            size: 60,
            height: 15,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 50
        });

        const mesh = new Mesh(
            text,
            new MeshStandardMaterial({ color: 0x99ffff, })
        );

        return mesh;
    }, []);

    const initScene = useCallback(async () =>
    {
        const mesh = await createText('RAYGASTER');

        app.scene.add(mesh);

        const loader = new GLTFLoader();

        const house = await loader.loadAsync('/modules/gltf/level1.gltf');

        house.scene.scale.set(20, 20, 20);

        house.scene.updateMatrixWorld();

        app.scene.add(house.scene);
    }, [createText]);

    useEffect(() =>
    {
        app.addArrowHelper();

        app.showStats(domEl);

        addLigth();

        initScene();

    }, [addLigth, initScene]);

    return (
        <div className="navigation" ref={domEl}>

        </div >
    );
}
