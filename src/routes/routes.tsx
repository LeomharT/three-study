import { IndexRouteProps, LayoutRouteProps, PathRouteProps } from "react-router-dom";
import Navigation from "../page/Navigation";
import PictureTransform from "../page/PictureTransform";

/** 路由数组 */
export default [
    {
        path: '/',
        element: <Navigation />
    }, {
        path: '/picture_transform',
        element: <PictureTransform />
    }
] as PathRouteProps[] & LayoutRouteProps[] & IndexRouteProps[];
