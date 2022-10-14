import { RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { BoxGeometry, EdgesGeometry, LineBasicMaterial, LineSegments } from "three";
import { app } from "../app/Application";
import useScene from "../hooks/useScene";

export default function Index()
{
    const container: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);


    useScene(container);


    const mesh = useMemo(() =>
    {
        const geometry = new BoxGeometry(100, 100, 100, 1, 1, 1);

        const edge = new EdgesGeometry(geometry);

        const line = new LineSegments(edge, new LineBasicMaterial({
            color: 'black', linewidth: 3
        }));

        return line;
    }, []);


    const initScene = useCallback(() =>
    {
        app.scene.add(mesh);

        app.renderer.setClearColor(0xffffff);

        app.renderer.fnList.push(function ()
        {
            mesh.rotation.y += 0.01;
        });
    }, [mesh]);


    useEffect(() =>
    {
        initScene();

    }, [initScene]);


    return (
        <div ref={container} id='container'>

        </div>
    );
}
