import { RefObject, useEffect, useRef } from "react";
import { ApplicationService } from "../../app/application-service";

export default function Animation()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const app: RefObject<ApplicationService> = useRef<ApplicationService>(new ApplicationService());

    useEffect(() =>
    {
        const instance = app.current;

        instance?.InitScene(domEl);

        return () =>
        {
            instance?.DisPoseScene();
        };
    }, []);

    return (
        <div ref={domEl}></div>
    );
}
