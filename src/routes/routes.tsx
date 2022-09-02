import { IndexRouteProps, LayoutRouteProps, PathRouteProps } from "react-router-dom";
import BaseScene from "../page/Basics/BaseScene";
import Navigation from "../page/Navigation";
import TTT from "../page/TTT";

/** 路由数组 */
export default [
    {
        path: '/',
        element: <Navigation />
    }, {
        path: '/base_scene',
        element: <BaseScene />
    }, {
        path: '/ttt',
        element: <TTT />
    }
] as PathRouteProps[] & LayoutRouteProps[] & IndexRouteProps[];
