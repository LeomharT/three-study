import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../routes/route";

export default function AsideNavi()
{
    const location = useLocation();

    const navigate = useNavigate();

    return (
        <Menu items={ROUTES}
            defaultOpenKeys={['Chapter01 Basics']}
            activeKey={location.pathname}
            mode='inline'
            onSelect={e =>
            {
                navigate(e.key);
            }}>

        </Menu>
    );
}
