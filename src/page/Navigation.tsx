import { Link } from "react-router-dom";
import routes from "../routes/routes";

export default function Navigation()
{
    return (
        <div className="navigation">
            {routes.map(r => (
                <p key={r.path}>
                    <Link to={r.path}>
                        {
                            r.path
                        }
                    </Link>
                </p>
            ))}
        </div >
    );
}
