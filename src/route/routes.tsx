import { IndexRouteProps, LayoutRouteProps, PathRouteProps } from "react-router-dom";
import PictureTransform from "../page/PictureTransform";

/** 路由数组 */
export default [
    {
        path: '/',
        element: <PictureTransform />
    }
] as PathRouteProps[] & LayoutRouteProps[] & IndexRouteProps[];
