import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AsideNavi from "../components/AsideNavi";
import Index from "../page/Index";
import { MenuItem, ROUTES } from "../routes/route";
import { Application } from "./Application";


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
    useLayoutEffect(() =>
    {
        new Application();
    }, []);

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}
