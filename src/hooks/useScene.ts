import { RefObject, useEffect } from "react";
import { ApplicationService } from "../app/application-service";

export default function useScene(app: RefObject<ApplicationService>, domEl: RefObject<HTMLElement>): void
{
    useEffect(() =>
    {
        app.current?.InitScene(domEl);

        return () =>
        {
            app.current?.DisPoseScene();
        };
    }, []);
}
