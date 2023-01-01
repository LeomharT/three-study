import { Easing, Tween } from "@tweenjs/tween.js";
import { useCallback, useEffect, useRef } from "react";
import { AmbientLight, BufferAttribute, CubeReflectionMapping, CubeRefractionMapping, CubeTextureLoader, DoubleSide, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, MirroredRepeatWrapping, NearestFilter, PerspectiveCamera, PlaneGeometry, RepeatWrapping, SphereGeometry, TextureLoader } from "three";
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
            rain.scale.y = Math.random() + 0.5;
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
            displacementScale: 0.15,
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

        app.scene.add(wall_back);
    }, []);


    const initScene = useCallback(() =>
    {
        setUpCamera();

        addLight();

        // addWalls();

        addBackground();

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
