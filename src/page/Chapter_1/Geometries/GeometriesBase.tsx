import { useCallback, useEffect, useRef } from "react";
import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function GeometriesBase()
{
    const container = useRef(null);

    useScene(container);

    const initScene = useCallback(() =>
    {
        const geometry = new BufferGeometry();

        const count = 5000;

        //三角形数 * 三个顶点 * 顶点坐标数(x,y,z)
        const position_array = new Float32Array(count * 3 * 3);

        for (let i = 0; i < count * 3 * 3; i++)
        {
            position_array[i] = Math.random();
        }

        const position_attribute = new BufferAttribute(position_array, 3);

        geometry.setAttribute('position', position_attribute);

        const material = new MeshBasicMaterial({
            color: 'red',
            wireframe: true
        });

        const mesh = new Mesh(
            geometry,
            material
        );

        app.scene.add(mesh);
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
