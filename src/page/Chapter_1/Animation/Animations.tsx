import { useEffect, useRef } from "react";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";

export default function Animation()
{
    const container = useRef(null);

    useScene(container);

    useEffect(() =>
    {
        app.renderer.fnList.push(() =>
        {
            console.log('ahah');
        });
    }, []);


    return (
        <div ref={container} id='container'>

        </div>
    );
}
