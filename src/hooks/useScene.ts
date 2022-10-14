import { RefObject, useEffect } from "react";
import { app } from "../app/Application";

export default function useScene(container: RefObject<HTMLDivElement>)
{
    useEffect(() =>
    {
        app.initScene(container);

        return () => app.disposeScene();
    }, [container]);
}
