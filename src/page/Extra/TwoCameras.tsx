import { Button } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from "three";
import { app, getContainerSize } from "../../app/Application";
import useScene from "../../hooks/useScene";

let isSecondCamera = true;

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

        const cube = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: 'red' })
        );

        app.scene.add(cube);

        app.renderer.fnList.push(() =>
        {
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

            camera2.position.set(0, 2, 3);
            camera2.lookAt(app.scene.position);
            camera2.updateProjectionMatrix();

            if (isSecondCamera)
                renderer.render(app.scene, camera2);

            cube.rotation.y += 0.02;

            renderer.setScissorTest(false);
        });


    }, []);


    useEffect(() =>
    {
        const { width, height } = getContainerSize();

        app.addArrowHelper();

        initScene(width, height);

    }, [initScene]);

    return (
        <div id='container' ref={container}>
            <Button children='显示/关闭 悬浮相机'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 330
                }}
                onClick={() =>
                {
                    isSecondCamera = !isSecondCamera;
                }} />
        </div>
    );

}
