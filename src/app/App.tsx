import { useLayoutEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AsideNavi from "../components/AsideNavi";
import Index from "../page/Index";
import { MenuItem, ROUTES } from "../routes/route";
import { Application } from "./Application";
import { pane } from "./core/pane";


const renderChildrenRoute = (route: MenuItem[]): MenuItem[] =>
{
    if (!route) return [];

    if (route.length === 1 && route[0].children) return route[0].children;

    const item = route.pop();

    const prve_children = item?.children ?? [];

    return prve_children.concat(renderChildrenRoute(route));
};

const ROUTE_COMPONENT = renderChildrenRoute(ROUTES);


export default function App()
{
    useLayoutEffect(() => { new Application(); }, []);

    const location = useLocation();

    useLayoutEffect(() =>
    {
        if (!location.pathname) return;

        if (!pane) return;

        pane.clear();

    }, [location]);


    return (
        <div id="app">
            <AsideNavi />
            <Routes>
                <Route path="/" element={<Index />} />
                {ROUTE_COMPONENT.map((r: MenuItem) =>
                (
                    <Route key={r.key} path={r.path} element={r.element} />
                ))}
            </Routes>
        </div>
    );
}
