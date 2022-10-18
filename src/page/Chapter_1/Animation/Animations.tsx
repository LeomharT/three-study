import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function Animation()
{
    const container = useRef(null);

    useScene(container);

    const initScene = useCallback(() =>
    {
        const cube = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 'red' })
        );

        app.scene.add(cube);

        app.renderer.fnList.push(() =>
        {
            cube.rotation.y += 0.002;
            cube.rotation.x += 0.002;
        });
    }, []);

    useEffect(() =>
    {
        initScene();
    }, []);


    return (
        <div ref={container} id='container'>

        </div>
    );
}
