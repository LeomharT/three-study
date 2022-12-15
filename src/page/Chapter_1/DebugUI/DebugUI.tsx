import { Easing, Tween } from "@tweenjs/tween.js";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import { pane } from "../../../app/core/pane";
import useScene from "../../../hooks/useScene";
export default function DebugUI()
{
    const container = useRef(null);

    const location = useLocation();

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
        const debugParams = {
            y: 0,
            color: 0xffffff
        };

        const target = {
            y: 0
        };

        const params = pane.addFolder({ title: "Params" });

        params.addInput(debugParams, 'y', {
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

        params.addInput(debugParams, 'color', {
            view: 'color'
        }).on('change', (e) =>
        {
            mesh.material.color = new Color(e.value);
        });

    }, []);


    useEffect(() =>
    {
        initScene();

        const { hash } = location;

        if (hash !== '#debug')
        {
            pane.hidden = true;
        }

    }, [initScene, location]);

    return (
        <div ref={container} id='container'>

        </div>
    );
}
