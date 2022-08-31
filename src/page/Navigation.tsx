import { RefObject, useCallback, useEffect, useRef } from "react";
import { AmbientLight, DirectionalLight, Group, MathUtils, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, Vector3 } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { app } from "../app/application-service";
import useScene from "../hooks/useScene";
export default function Navigation()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    const addLigth = useCallback(() =>
    {
        const direc_light = new DirectionalLight(0xffffff);
        direc_light.position.set(10, 10, -10);
        direc_light.intensity = 1.3;
        app.scene.add(direc_light);

        const ambient_light = new AmbientLight(0x003973);
        ambient_light.intensity = 1.3;
        app.scene.add(ambient_light);
    }, []);

    const addBasicsSceneModule: () => Promise<any> = useCallback(async () =>
    {
        const loader = new GLTFLoader();

        const module = await loader.loadAsync('/modules/gltf/basic-scene.gltf');

        const basic_scene: Group = module.scene;

        basic_scene.rotateOnAxis(
            new Vector3(0, 1, 0),
            180 * MathUtils.DEG2RAD
        );
        basic_scene.scale.set(50, 50, 50);

        const cubes: Mesh = basic_scene.children[0] as Mesh;

        //不要使用基础材质会报错,使用物理或者标准材质
        const material = new MeshPhysicalMaterial({
            envMap: app.webGLRenderTarget.texture,
            color: 0x665e9f,
            roughness: 0.6,    //->粗糙度
            metalness: 1,    //->金属度 1金属 0非金属 通常没有中间值
        });

        cubes.material = material;

        const axises = {
            axisY: basic_scene.children[1] as Mesh,
            axisZ: basic_scene.children[2] as Mesh,
            axisX: basic_scene.children[3] as Mesh,
        };

        (axises.axisX.material as MeshPhongMaterial) = new MeshPhongMaterial({ color: 0xec78eb });
        (axises.axisY.material as MeshPhongMaterial) = new MeshPhongMaterial({ color: 0x2db0b5 });
        (axises.axisZ.material as MeshPhongMaterial) = new MeshPhongMaterial({ color: 0x8e7de6 });


        app.scene.add(basic_scene);
    }, []);

    useEffect(() =>
    {
        app.addArrowHelper();

        addLigth();

        addBasicsSceneModule();

    }, [addBasicsSceneModule, addLigth]);

    return (
        <div className="navigation" ref={domEl}>

        </div >
    );
}
