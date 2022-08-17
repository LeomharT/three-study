import { BrowserRouter, Route, Routes } from "react-router-dom";
import routes from "../route/routes";

/**
 * 主组件
 */
export default function App()
{
    return (
        <BrowserRouter basename="/">
            <Routes>
                {
                    routes.map(r => <Route path={r.path} element={r.element} />)
                }
            </Routes>
        </BrowserRouter>
    );
}
