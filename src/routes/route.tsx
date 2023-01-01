import { BookTwoTone } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Animation from '../page/Chapter_1/Animation/Animations';
import CameraBase from '../page/Chapter_1/Camera/CameraBase';
import DebugUI from '../page/Chapter_1/DebugUI/DebugUI';
import GeometriesBase from '../page/Chapter_1/Geometries/GeometriesBase';
import TranslateObject from '../page/Chapter_1/TranslateObject/TranslateObject';
import WoodMaterial from '../page/Chapter_1/WoodMaterial/WoodMaterial';
import WoodTexture from '../page/Chapter_1/WoodTexture/WoodTexture';
import Rain from '../page/Extra/Rain';
import Stickers from '../page/Extra/Stickers';
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
            setItems({ label: 'GeometriesBase', key: '/geometries_base', path: '/geometries_base', element: <GeometriesBase /> }),
            setItems({ label: 'DebugUI', key: '/debugui', path: '/debugui', element: <DebugUI /> }),
            setItems({ label: 'WoodTexture', key: '/woodtexture', path: '/woodtexture', element: <WoodTexture /> }),
            setItems({ label: 'WoodMaterial', key: '/woodMaterial', path: '/woodMaterial', element: <WoodMaterial /> }),
        ]
    }),
    setItems({
        label: 'Extra', key: 'Extra', icon: <BookTwoTone />, children: [
            setItems({ label: 'TwoCamera', key: '/two_camera', path: '/two_camera', element: <TwoCameras /> }),
            setItems({ label: 'Rain', key: '/rain', path: '/rain', element: <Rain /> }),
            setItems({ label: 'Stickers', key: '/stickers', path: '/stickers', element: <Stickers /> }),
        ]
    }),
];
