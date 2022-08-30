import { RefObject, useEffect, useRef } from "react";
import { AmbientLight, BufferGeometry } from "three";
import { app } from "../app/application-service";
import useScene from "../hooks/useScene";

export default function BufferGeometryPic()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    useEffect(() =>
    {
        app.scene.add(new AmbientLight(0x4444444));

        const gemoetry = new BufferGeometry();


    }, []);

    return (
        <div ref={domEl}>

        </div>
    );
}
