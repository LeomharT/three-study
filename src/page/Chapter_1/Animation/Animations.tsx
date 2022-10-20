import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Clock, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function Animation()
{
    const container = useRef(null);

    const { current: clock } = useRef<Clock>(new Clock());

    useScene(container);

    const initScene = useCallback(() =>
    {
        app.addArrowHelper();

        const cube = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 'red' })
        );

        const cube2 = cube.clone(true);

        cube2.position.y = 2;

        cube.add(cube2);

        app.scene.add(cube);

        app.renderer.fnList.push(() =>
        {
            const elapsed_time = clock.getElapsedTime();

            //Update object
            cube.position.y = Math.sin(elapsed_time);
            cube.position.x = Math.cos(elapsed_time);
        });
    }, [clock]);

    useEffect(() =>
    {
        initScene();
    }, [initScene]);


    return (
        <div ref={container} id='container'>

        </div>
    );
}
