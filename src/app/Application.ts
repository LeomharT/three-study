import { message } from "antd";
import _Camera from "./core/_camera";

export let app: Application;

export class Application
{
    constructor()
    {
        app = this;
    }

    public camera: _Camera = new _Camera();
}

export const getContainerSize = (): { width: number, heigh: number; } =>
{
    const container = document.querySelector('#container');

    if (!container)
    {
        message.error("没有加载出容器,请刷新重试");
        return {
            width: document.body.clientWidth,
            heigh: document.body.clientHeight,
        };;
    }

    return {
        width: container.clientWidth,
        heigh: container.clientHeight
    };
};
