import { useCallback, useEffect, useRef } from "react";
import { AmbientLight, BufferAttribute, CubeTextureLoader, DoubleSide, Mesh, MeshStandardMaterial, NearestFilter, PlaneGeometry, PointLight, SphereGeometry, TextureLoader, TorusGeometry } from "three";
import { app } from "../../../app/Application";
import { pane } from "../../../app/core/pane";
import useScene from "../../../hooks/useScene";

export default function WoodMaterial()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const initScene = useCallback(() =>
    {
        const textureLoader = new TextureLoader();
        textureLoader.setPath('/assets/texture/door/');

        const doorColorTexture = textureLoader.load('Door_Wood_001_basecolor.jpg');
        const doorAlphaTexture = textureLoader.load('Door_Wood_001_opacity.jpg');
        const doorNormalTexture = textureLoader.load('Door_Wood_001_normal.jpg');
        const doorRoughnessTexture = textureLoader.load('Door_Wood_001_roughness.jpg');
        const doorMetallicTexture = textureLoader.load('Door_Wood_001_metallic.jpg');
        const doorAmbientOcclusionTexture = textureLoader.load('Door_Wood_001_ambientOcclusion.jpg');
        const doorHeightTexture = textureLoader.load('Door_Wood_001_height.png');


        const cubeTexture = new CubeTextureLoader();
        cubeTexture.setPath('/assets/texture/environmentMaps/0/');

        const cubeEnv = cubeTexture.load([
            'px.jpg',
            'nx.jpg',
            'py.jpg',
            'ny.jpg',
            'pz.jpg',
            'nz.jpg',
        ]);


        const material = new MeshStandardMaterial({
            transparent: true,                   //->允许隐藏
            map: doorColorTexture,               //->基础贴图
            side: DoubleSide,                    //->材质会在前面和背面都显示
            alphaMap: doorAlphaTexture,          //->Alpha贴图,白色显示,黑色隐藏
            aoMap: doorAmbientOcclusionTexture,  //->环境阴影贴图,需要设置uv2属性才能使用
            displacementMap: doorHeightTexture,
            displacementScale: 0.05,
            roughnessMap: doorRoughnessTexture,
            metalnessMap: doorMetallicTexture,
            normalMap: doorNormalTexture,
            envMap: cubeEnv
        });


        pane.addInput(material, 'roughness', {
            min: 0,
            max: 1,
            step: 0.0001
        });

        pane.addInput(material, 'metalness', {
            min: 0,
            max: 1,
            step: 0.0001
        });

        pane.addInput(material, 'aoMapIntensity', {
            min: 0,
            max: 10,
        });

        pane.addInput(material, 'displacementScale', {
            min: 0,
            max: 1,
        });

        doorColorTexture.magFilter = NearestFilter;

        const sphere = new Mesh(
            new SphereGeometry(0.5, 64, 64),
            material
        );
        sphere.translateX(-1.5);
        sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2));

        const plane = new Mesh(
            new PlaneGeometry(1, 1, 100, 100),
            material
        );
        plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2));

        const torus = new Mesh(
            new TorusGeometry(0.3, 0.2, 64, 128),
            material
        );
        torus.translateX(1.5);
        torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2));

        app.scene.add(sphere, plane, torus);

        const ambientLight = new AmbientLight(0xffffff, 1);
        app.scene.add(ambientLight);

        const pointLight = new PointLight(0xffffff, 1);
        pointLight.position.x = 2;
        pointLight.position.y = 3;
        pointLight.position.z = 4;
        app.scene.add(pointLight);

    }, []);


    useEffect(() =>
    {
        initScene();
    }, [initScene]);

    return (
        <div id='container' ref={container}>
        </div>
    );
}
