import { useRef } from "react";
import useScene from "../../hooks/useScene";

export default function TranslateObject()
{
    const container = useRef(null);

    useScene(container);

    return (
        <div ref={container}>

        </div>
    );
}
