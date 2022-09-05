import { RefObject, useCallback, useEffect, useRef } from "react";
import { AmbientLight, Color, PointLight } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { app } from "../app/application-service";
import useScene from "../hooks/useScene";

export default function TTT()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const loader: RefObject<GLTFLoader> = useRef<GLTFLoader>(new GLTFLoader());

    useScene(domEl);

    const addBnhustoft = async () =>
    {
        if (!loader.current) return;

        loader.current.setPath("/modules/gltf").setResourcePath("/modules/gltf/bnhustoft_leirvik_froyar/");

        const gltf = await loader.current.loadAsync('/bnhustoft_leirvik_froyar/scene.gltf');

        const module = gltf.scene;

        module.scale.set(10, 10, 10);

        app.scene.add(module);
    };

    const addApollo = async () =>
    {
        if (!loader.current) return;

        loader.current.setPath("/modules/gltf").setResourcePath("/modules/gltf/apollo_11_command_module_combined/");

        const gltf = await loader.current.loadAsync('/apollo_11_command_module_combined/scene.gltf');

        const module = gltf.scene;

        module.scale.set(20, 20, 20);

        app.scene.add(module);
    };

    const addLigth = () =>
    {
        const ambient_light = new AmbientLight();

        ambient_light.color = new Color(0xffffff);
        ambient_light.intensity = 1;

        const point_light = new PointLight();
        point_light.color = new Color().setHSL(.6, .7, .8);
        point_light.position.set(0, 0, 0);

        app.helper.addPointLightHelper(point_light);


        app.scene.add(ambient_light);
        app.scene.add(point_light);
    };

    const initScene = useCallback(() =>
    {
        app.showStats(domEl);

        addApollo();

        addLigth();
    }, []);

    useEffect(() =>
    {
        initScene();
    }, []);


    return (
        <div ref={domEl}>

        </div>
    );
}
