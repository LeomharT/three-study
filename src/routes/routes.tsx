import { IndexRouteProps, LayoutRouteProps, PathRouteProps } from "react-router-dom";
import Animation from "../page/Basics/Animation";
import Navigation from "../page/Navigation";

/** 路由数组 */
export default [
    {
        path: '/',
        element: <Navigation />
    }, {
        path: '/animation',
        element: <Animation />
    }
] as PathRouteProps[] & LayoutRouteProps[] & IndexRouteProps[];
