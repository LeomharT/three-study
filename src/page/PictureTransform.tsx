import { RefObject, useEffect, useRef } from "react";
import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from "three";
import { ApplicationService } from "../app/application-service";

export default function PictureTransform()
{
    const domEl: RefObject<HTMLDivElement> = useRef(null);

    const app: RefObject<ApplicationService> = useRef<ApplicationService>(new ApplicationService());

    useEffect(() =>
    {
        app.current?.InitScene(domEl);

        const cube = new Mesh(
            new BoxBufferGeometry(200, 200, 200),
            new MeshBasicMaterial({ color: "gold" })
        );
        app.current?.scene.add(cube);
    }, []);
    return (
        <div ref={domEl}>

        </div>
    );
}
