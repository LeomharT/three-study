import { useLayoutEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "../routes/routes";
import { Application } from "./application-service";
/**
 * 主组件
 */
export default function App()
{
    /** Switch to dark theme */
    useLayoutEffect(() =>
    {
        const root = document.querySelector(":root") as HTMLElement;

        if (root.classList.contains('bp4-dark')) return;

        root.classList.add('bp4-dark');

        new Application();
    }, []);
    return (
        <BrowserRouter basename="/">
            <Routes>
                {
                    routes.map(r => <Route key={r.path} path={r.path} element={r.element} />)
                }
            </Routes>
        </BrowserRouter>
    );
}
