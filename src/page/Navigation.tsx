import { RefObject, useCallback, useEffect, useRef } from "react";
import { AmbientLight, BoxBufferGeometry, DirectionalLight, Mesh, MeshBasicMaterial } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { app } from "../app/application-service";
import { RendererLayers } from "../app/core/renderer";
import useScene from "../hooks/useScene";
export default function Navigation()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    const addLigth: () => void = useCallback(() =>
    {
        const direc_light = new DirectionalLight(0xffffff);
        direc_light.position.set(10, 10, -10);
        direc_light.intensity = 1.5;
        app.scene.add(direc_light);

        const ambient_light = new AmbientLight(0x003973);
        ambient_light.intensity = 2;
        app.scene.add(ambient_light);
    }, []);

    const initScene = useCallback(async () =>
    {
        const loader = new GLTFLoader();

        // const house = await loader.loadAsync('/modules/gltf/basic-scene.gltf');

        // house.scene.scale.set(20, 20, 20);

        // house.scene.updateMatrixWorld();

        const cube = new Mesh(
            new BoxBufferGeometry(50, 50, 50),
            new MeshBasicMaterial({ color: 'gold' })
        );

        console.log(cube);
        app.scene.add(cube);
        cube.layers.enable(RendererLayers.BLOOM_SCENE);
        console.log(app.renderer.outlinePass);
        // app.renderer.outlinePass.selectedObjects = [cube];
        // app.scene.add(house.scene);
    }, []);

    useEffect(() =>
    {
        app.controler.onlyFront();

        app.controler.prveentButtom();

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
