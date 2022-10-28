import { Easing, Tween } from '@tweenjs/tween.js';
import { GUI } from 'lil-gui';
import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

const debugObject = {
    y: 0,
    spin: () =>
    {

    }
};

export default function DebugUI()
{
    const container = useRef(null);

    useScene(container);

    const { current: gui } = useRef<GUI>(new GUI());


    const initScene = useCallback(() =>
    {
        const material = new MeshBasicMaterial({ color: 'red' });

        const mesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            material
        );

        app.scene.add(mesh);

        /**
         * Debuger
         */
        const position = {
            y: debugObject.y
        };
        const tween = new Tween(position);
        gui.add(debugObject, 'y')  //错的,不能直接指向mesh的对象
            .min(-3)
            .max(3)
            .step(0.01)
            .name('positionY')
            .onChange((e: any) =>
            {
                console.log(position.y);
                tween
                    .to({ y: e })
                    .easing(Easing.Quadratic.Out)
                    .onUpdate(() =>
                    {
                        mesh.position.y = position.y;
                    })
                    .start();
            });

        gui.add(mesh, 'visible');

        gui.add(material, 'wireframe');

        gui.addColor(material, 'color');

    }, []);


    useEffect(() =>
    {
        initScene();
    }, [initScene]);

    return (
        <div ref={container} id='container'>

        </div>
    );
}
