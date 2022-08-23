import { RefObject, useEffect, useRef } from "react";
import { Box3, Color, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { app } from "../../app/application-service";
import useScene from "../../hooks/useScene";
export default function BaseScene()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    useEffect(() =>
    {
        app.addArrowHelper();
        app.scene.background = new Color(0xE8E8E8);

        new FontLoader().load('/data/gentilis_regular.typeface.json', (font: Font) =>
        {
            const text = new TextGeometry('FIRST SCENE', {
                font,
                size: 60,
                height: 25,
                curveSegments: 6,

            });

            const mesh = new Mesh(
                text,
                new MeshBasicMaterial({ color: "red", wireframe: true })
            );

            mesh.geometry.translate(-300, 0, 100);

            //利用BOX获取大小
            const box = new Box3().setFromObject(mesh);

            mesh.translateOnAxis(
                new Vector3(1, 0, 0),
                -(box.max.x / 2)
            );

            mesh.rotateOnWorldAxis(
                new Vector3(0, 1, 0),
                90 * MathUtils.DEG2RAD
            );

            console.log(box);

            app.scene.add(mesh);

        });

    }, []);

    return (
        <div ref={domEl}></div>
    );
}
