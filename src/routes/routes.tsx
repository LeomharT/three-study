import { IndexRouteProps, LayoutRouteProps, PathRouteProps } from "react-router-dom";
import BaseScene from "../page/Basics/BaseScene";
import Navigation from "../page/Navigation";

/** 路由数组 */
export default [
    {
        path: '/',
        element: <Navigation />
    }, {
        path: '/base_scene',
        element: <BaseScene />
    }
] as PathRouteProps[] & LayoutRouteProps[] & IndexRouteProps[];
