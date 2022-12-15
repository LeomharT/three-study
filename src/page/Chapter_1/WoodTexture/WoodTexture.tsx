import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, TextureLoader } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function WoodTexture()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const initScene = useCallback(() =>
    {
        const textureLoader = new TextureLoader();

        const doorColorTexture = textureLoader.load('/assets/door/Door_Wood_001_basecolor.jpg');

        const geometry = new BoxGeometry(1, 1, 1);

        const material = new MeshBasicMaterial({
            map: doorColorTexture
        });

        const cube = new Mesh(geometry, material);

        app.scene.add(cube);

    }, []);


    useEffect(() =>
    {
        app.showStatus();

        initScene();
    }, [initScene]);


    return (
        <div ref={container} id='container'>

        </div>
    );
}
