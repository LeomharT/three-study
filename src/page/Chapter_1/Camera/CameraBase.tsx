import { useCallback, useEffect, useRef } from "react";
import useScene from "../../../hooks/useScene";

export default function CameraBase()
{
    const container = useRef(null);

    useScene(container);


    const initScene = useCallback(() =>
    {

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
