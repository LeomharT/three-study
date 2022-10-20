import { BookTwoTone } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Animation from '../page/Chapter_1/Animation/Animations';
import CameraBase from '../page/Chapter_1/Camera/CameraBase';
import TranslateObject from '../page/Chapter_1/TranslateObject/TranslateObject';
import TwoCameras from '../page/Extra/TwoCameras';

export type MenuItem = Required<MenuProps>['items'][number] &
{
    path: string;
    element?: React.ReactNode;
    children?: MenuItem[];
};

export type SetItemsProps = {
    label: React.ReactNode;
    key: React.Key;
    path?: string;
    icon?: React.ReactNode;
    element?: React.ReactNode;
    children?: MenuItem[];
    type?: 'group';
};
export function setItems({ label, key, path, type, icon, children, element }: SetItemsProps)
{
    return { key, icon, path, children, label, type, element } as MenuItem;
}

export const ROUTES: MenuItem[] = [
    setItems({
        label: 'Chapter01 Basics', key: 'Chapter01 Basics', icon: <BookTwoTone />, children: [
            setItems({ label: 'Transform Objects', key: '/transform_objects', path: '/transform_objects', element: <TranslateObject /> }),
            setItems({ label: 'Animations', key: '/animations', path: '/animations', element: <Animation /> }),
            setItems({ label: 'CameraBase', key: '/camera_base', path: '/camera_base', element: <CameraBase /> }),
        ]
    }),
    setItems({
        label: 'Extra', key: 'Extra', icon: <BookTwoTone />, children: [
            setItems({ label: 'two_camera', key: '/two_camera', path: '/two_camera', element: <TwoCameras /> }),
        ]
    }),
];
