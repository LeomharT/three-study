import { BrowserRouter, Route, Routes } from "react-router-dom";
import AsideNavi from "../components/AsideNavi";
import { MenuItem, ROUTES } from "../routes/route";


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
    return (
        <BrowserRouter>
            <div id="app">
                <AsideNavi />
                <Routes>
                    {ROUTE_COMPONENT.map((r: MenuItem) =>
                    (
                        <Route key={r.key} path={r.path} element={r.element} />
                    ))}
                </Routes>
            </div>
        </BrowserRouter>
    );
}
