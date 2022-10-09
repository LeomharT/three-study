import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AsideNavi from "../components/AsideNavi";
import { MenuItem, ROUTES } from "../routes/route";

export default function App()
{

    useEffect(() =>
    {

        console.log(ROUTES);
    }, []);

    return (
        <BrowserRouter>
            <div id="app">
                <AsideNavi />
                {/* <Routes> */}
                {ROUTES.map((r: MenuItem) =>
                {
                    if (!r.children) return null;


                })}
                {/* </Routes> */}
            </div>
        </BrowserRouter>
    );
}
