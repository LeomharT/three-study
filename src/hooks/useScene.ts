import { RefObject, useEffect, useRef } from "react";
import { ApplicationService } from "../app/application-service";

export default function useScene(domEl: RefObject<HTMLDivElement>): void
{
    const app: RefObject<ApplicationService> = useRef<ApplicationService>(new ApplicationService());

    useEffect(() =>
    {
        const instance = app.current;

        instance?.InitScene(domEl);

        return () =>
        {
            instance?.DisPoseScene();
        };
    }, [domEl]);
}
