import { Easing, Tween } from "@tweenjs/tween.js";
import { useCallback, useEffect, useRef } from "react";
import { AmbientLight, BufferAttribute, CubeReflectionMapping, CubeRefractionMapping, CubeTextureLoader, DoubleSide, Euler, MathUtils, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MirroredRepeatWrapping, NearestFilter, PerspectiveCamera, PlaneGeometry, RepeatWrapping, SphereGeometry, TextureLoader, Vector3 } from "three";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { app } from "../../app/Application";
import { pane } from "../../app/core/pane";
import useScene from "../../hooks/useScene";
import { ramomValue } from "../../util/randomValue";

export default function Rain()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const setUpCamera = useCallback(() =>
    {
        const camera = app.camera.activeCamera as PerspectiveCamera;

        camera.position.set(10, 10, 10);
        camera.lookAt(app.scene.position);
        camera.updateProjectionMatrix();
    }, []);


    const addLight = useCallback(() =>
    {
        const ambient_light = new AmbientLight(0xffffff, 1);

        app.scene.add(ambient_light);

        const light_folder = pane.addFolder({ title: 'Light' });

        light_folder.addInput(ambient_light, 'intensity', {
            min: 0,
            max: 10,
            step: 0.01
        });

    }, []);


    const addBackground = useCallback(() =>
    {
        const env = new CubeTextureLoader()
            .setPath('/assets/texture/environmentMaps/2/')
            .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

        app.scene.background = env;

        const rain_material = new MeshBasicMaterial({
            envMap: env,
            transparent: true
        });

        const rain_geometry = new SphereGeometry(1, 4, 4);

        pane.addButton({ title: 'reflact' })
            .on('click', () =>
            {
                rain_material.needsUpdate = true;
                if (env.mapping === CubeReflectionMapping) env.mapping = CubeRefractionMapping;
                else env.mapping = CubeReflectionMapping;
            });

        const rain_params = {
            count: 200
        };

        const rain_base = new Mesh(rain_geometry, rain_material);


        for (let i = 0; i < rain_params.count; i++)
        {
            const rain = rain_base.clone();

            rain.scale.x = 0.1;
            rain.scale.y = Math.random() + 1.5;
            rain.scale.z = 0.1;

            rain.rotation.z = 15 * MathUtils.DEG2RAD;

            rain.position.set(ramomValue(-20, 20), 100, ramomValue(-20, 20));

            const delay = ramomValue(0, 1000);

            new Tween(rain.position)
                .to({ y: -10 })
                .delay(delay)
                .duration(1000)
                .easing(Easing.Quartic.In)
                .repeat(Infinity)
                .onUpdate(v =>
                {
                    console.log(v);
                })
                .start();
            app.scene.add(rain);
        }
    }, []);


    const addWalls = useCallback(() =>
    {
        const textureLoader = new TextureLoader();

        textureLoader.setPath('/assets/texture/bricks084/');

        const brick_ambientOcclusion = textureLoader.load('Bricks084_4K_AmbientOcclusion.jpg');
        const brick_color = textureLoader.load('Bricks084_4K_Color.jpg');
        const brick_displacement = textureLoader.load('Bricks084_4K_Displacement.jpg');
        const brick_normal = textureLoader.load('Bricks084_4K_NormalGL.jpg');
        const brick_roughness = textureLoader.load('Bricks084_4K_Roughness.jpg');

        brick_color.wrapS = RepeatWrapping;
        brick_color.wrapT = RepeatWrapping;
        brick_color.repeat.x = 5;
        brick_color.repeat.y = 5;
        brick_ambientOcclusion.wrapS = RepeatWrapping;
        brick_ambientOcclusion.wrapT = RepeatWrapping;
        brick_ambientOcclusion.repeat.x = 5;
        brick_ambientOcclusion.repeat.y = 5;
        brick_displacement.wrapS = MirroredRepeatWrapping;
        brick_displacement.wrapT = MirroredRepeatWrapping;
        brick_displacement.repeat.x = 5;
        brick_displacement.repeat.y = 5;

        brick_color.minFilter = NearestFilter;
        brick_color.magFilter = NearestFilter;


        const wall_gemotry = new PlaneGeometry(5, 5, 64, 64);
        wall_gemotry.setAttribute('uv2', new BufferAttribute(wall_gemotry.getAttribute('uv').array, 2));

        const wall_material = new MeshStandardMaterial({
            transparent: true,
            map: brick_color,
            aoMap: brick_ambientOcclusion,
            normalMap: brick_normal,
            displacementMap: brick_displacement,
            displacementScale: 0,
            roughnessMap: brick_roughness,
            side: DoubleSide,
        });

        pane.addInput(wall_material, 'roughness', {
            min: 0,
            max: 1,
            step: 0.0001
        });

        pane.addInput(wall_material, 'displacementScale', {
            min: 0,
            max: 1,
        });

        const wall_back = new Mesh(wall_gemotry, wall_material);

        //Decal
        textureLoader.setPath('/assets/texture/');
        const shutte_diffuse = textureLoader.load('shutter-Diffuse.png');

        function createMaterial()
        {
            const material_shutte_diffuse = new MeshPhysicalMaterial({
                map: shutte_diffuse,
                transparent: true,
                polygonOffset: true,
                polygonOffsetFactor: -10,
                roughness: 1,
                clearcoat: 0.5,
                metalness: 0.75,
                toneMapped: false,
            });
            const material_shutte_diffuse_folder = pane.addFolder({ title: "decalParams" });
            material_shutte_diffuse_folder.addInput(material_shutte_diffuse, 'roughness', { min: 0, max: 1, step: 0.001 }).on('change', () => material_shutte_diffuse.needsUpdate = true);
            material_shutte_diffuse_folder.addInput(material_shutte_diffuse, 'metalness', { min: 0, max: 1, step: 0.001 }).on('change', () => material_shutte_diffuse.needsUpdate = true);

            return material_shutte_diffuse;
        }

        const decal_material = createMaterial();

        const decal_params = {
            x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, rotationZ: -Math.PI / 2,
        };

        function decal_test()
        {
            wall_back.remove(...wall_back.children);

            const decal_shutte_diffuse = new DecalGeometry(
                wall_back,
                new Vector3(decal_params.x, decal_params.y, decal_params.z),
                new Euler(decal_params.rotationX, decal_params.rotationY, decal_params.rotationZ, 'XYZ'),
                new Vector3(decal_params.scale, decal_params.scale, decal_params.scale)
            );

            const decal_test = new Mesh(decal_shutte_diffuse, decal_material);

            wall_back.add(decal_test);
        }

        decal_test();

        const decal_folder = pane.addFolder({ title: 'DecalParams' });
        decal_folder.addInput(decal_params, 'x', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());
        decal_folder.addInput(decal_params, 'y', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;
        decal_folder.addInput(decal_params, 'z', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;
        decal_folder.addInput(decal_params, 'rotationX', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;
        decal_folder.addInput(decal_params, 'rotationY', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;
        decal_folder.addInput(decal_params, 'rotationZ', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;
        decal_folder.addInput(decal_params, 'scale', { min: -10, max: 10, step: 0.001 }).on('change', () => decal_test());;

        app.scene.add(wall_back);
    }, []);


    const initScene = useCallback(() =>
    {
        // setUpCamera();

        addLight();

        addWalls();

        // addBackground();

        app.addArrowHelper();

    }, [addLight]);

    useEffect(() =>
    {
        initScene();
    }, [initScene]);


    return (
        <div id="container" ref={container}></div>
    );
}
