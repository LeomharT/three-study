import { Link } from "react-router-dom";

export default function AsideNavi()
{
    return (
        <aside>
            <Link to={'/one'} children={'one'} />
            <Link to={'/tow'} children={'tow'} />
        </aside>
    );
}
