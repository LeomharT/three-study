import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from "three";
import { app, getContainerSize } from "../../app/Application";
import useScene from "../../hooks/useScene";

export default function TwoCameras()
{
    const container = useRef<HTMLDivElement>(null);


    useScene(container);


    const initScene = useCallback((width: number, height: number) =>
    {
        const renderer = app.renderer.webGLRenderer;

        const innerWidth = width / 4;
        const innerHeight = height / 4;

        const camera2 = new PerspectiveCamera(
            70,
            width / height,
            .1,
            10
        );

        app.camera.activeCamera.add(camera2);

        const cube = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 'red' })
        );

        app.scene.add(cube);


        app.renderer.fnList.push(() =>
        {
            renderer.setViewport(
                0, 0,
                width, height
            );

            renderer.render(app.scene, app.camera.activeCamera);


            renderer.clearDepth();

            renderer.setScissorTest(true);

            renderer.setScissor(
                width - innerWidth,
                height - innerHeight,
                innerWidth,
                innerHeight
            );

            renderer.setViewport(
                width - innerWidth,
                height - innerHeight,
                innerWidth,
                innerHeight
            );

            renderer.render(app.scene, camera2);


            renderer.setScissorTest(false);
        });


    }, []);


    useEffect(() =>
    {
        const { width, height } = getContainerSize();

        initScene(width, height);

    }, [initScene]);

    return (
        <div id='container' ref={container}>

        </div>
    );

}
