import { RefObject, useEffect } from "react";
import { app } from "../app/application-service";

export default function useScene(domEl: RefObject<HTMLDivElement>): void
{
    useEffect(() =>
    {
        app?.initScene(domEl);

        return () =>
        {
            app?.disPoseScene();
        };
    }, [domEl]);
}
