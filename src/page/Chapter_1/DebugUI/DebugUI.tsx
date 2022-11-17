import { Easing, Tween } from "@tweenjs/tween.js";
import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import { pane } from "../../../app/core/pane";
import useScene from "../../../hooks/useScene";
export default function DebugUI()
{
    const container = useRef(null);

    useScene(container);

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
            y: 0
        };

        const target = {
            y: 0
        };

        const params = pane.addFolder({ title: "Params" });

        params.addInput(position, 'y', {
            min: -3,
            max: 3,
            step: 0.01,
            label: 'positionY',
        }).on('change', e =>
        {
            new Tween(target)
                .to({ y: e.value })
                .duration(20000)
                .easing(Easing.Quadratic.Out)
                .onUpdate((v) =>
                {
                    mesh.position.y = v.y;
                })
                .start();
        });

        // gui.add(debugObject, 'y')  //错的,不能直接指向mesh的对象
        //     .min(-3)
        //     .max(3)
        //     .step(0.01)
        //     .name('positionY')
        //     .onChange((e: any) =>
        //     {
        //         console.log(position.y);
        //         new Tween(position)
        //             .to({ y: e }, 20)
        //             .easing(Easing.Quadratic.Out)
        //             .onUpdate(() =>
        //             {
        //                 mesh.position.y = position.y;
        //             })
        //             .start();
        //     });

        // gui.add(mesh, 'visible');

        // gui.add(material, 'wireframe');

        // gui.addColor(material, 'color');

        // debugObject.spin = () =>
        // {
        //     new Tween(position)
        //         .to({ y: 2 })
        //         .duration(3)
        //         .easing(Easing.Quadratic.Out)
        //         .onUpdate(() =>
        //         {
        //             mesh.position.y = position.y;
        //         })
        //         .start();
        // };

        // gui.add(debugObject, 'spin');

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
