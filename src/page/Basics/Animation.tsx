import { RefObject, useRef } from "react";
import useScene from "../../hooks/useScene";

export default function Animation()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useScene(domEl);

    return (
        <div ref={domEl}></div>
    );
}
