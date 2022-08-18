import { RefObject, useEffect, useRef } from "react";
import { ImageLoader } from "three";
//@ts-ignore
import { ApplicationService } from "../app/application-service";
import springJpg from '../assets/image/spring.jpg';
import winterJpg from '../assets/image/winter.jpg';
import useScene from "../hooks/useScene";
export default function PictureTransform()
{
    const domEl: RefObject<HTMLDivElement> = useRef(null);

    const app: RefObject<ApplicationService> = useRef<ApplicationService>(new ApplicationService());

    /** 组件挂载时加载三维场景 */
    useScene(app, domEl);

    useEffect(() =>
    {
        const winter = new ImageLoader().setCrossOrigin('Anonymous').load(winterJpg);

        const spring = new ImageLoader().setCrossOrigin('Anonymous').load(springJpg);

    }, []);
    return (
        <div ref={domEl}>

        </div>
    );
}
