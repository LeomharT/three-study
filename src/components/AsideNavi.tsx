import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { ROUTES } from "../routes/route";

const route = [...ROUTES];

export default function AsideNavi()
{
    const location = useLocation();

    const navigate = useNavigate();


    const [collapsed, setCollapsed] = useState<boolean>(true);


    const toggleCollapsed = useCallback(() =>
    {
        setCollapsed(!collapsed);
    }, [collapsed]);


    return (
        <>
            <Menu
                theme='dark'
                items={route}
                defaultOpenKeys={['Chapter01 Basics']}
                selectedKeys={[location.pathname]}
                mode='inline'
                style={{ translate: collapsed ? '-250px' : '0' }}
                onSelect={e =>
                {
                    navigate(e.key);
                }}>

            </Menu>
            <Button type="primary"
                onClick={toggleCollapsed}
                className='close-menu'
            >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
        </>
    );
}
