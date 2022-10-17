import { useCallback, useEffect, useRef } from "react";
import { BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera } from "three";
import { app } from "../../../app/Application";
import useScene from "../../../hooks/useScene";


export default function TranslateObject()
{
    const container = useRef(null);

    useScene(container);


    const setUpCamera = useCallback(() =>
    {
        const camera = app.camera.activeCamera as PerspectiveCamera;

        camera.position.set(0, 0, 3);
        camera.lookAt(app.scene.position);
        camera.updateProjectionMatrix();
    }, []);


    /** 移动对象->Position */
    const moveObject = useCallback((mesh: Mesh) =>
    {
        const camera = app.camera.activeCamera as PerspectiveCamera;

        mesh.position.y = 1;

        mesh.position.x = 2;

        //获取对象距离场景中心的值
        console.log(mesh.position.length());

        //获取对象距离指定对象的距离
        console.log(mesh.position.distanceTo(camera.position));

        //归一化->将数值缩放到0-1之间
        console.log(mesh.position.normalize());
    }, []);


    /** 缩放对象->Scale */
    const scaleObject = useCallback((mesh: Mesh) =>
    {
        mesh.scale.x = 2;

        mesh.scale.set(1, 1, 1);
    }, []);


    /** 旋转对象->Rotation Quaternion */
    const rotateObject = useCallback((mesh: Mesh) =>
    {
        //修改轴顺序
        mesh.rotation.reorder('YXZ');

        //使用欧拉角会有旋转后坐标偏移问题
        //PI表示旋转180度
        mesh.rotation.y = Math.PI * 0.25;


        //四元数->复制对象四元数到指定对象即可

    }, []);


    const initScene = useCallback(() =>
    {
        setUpCamera();


        const mesh = new Mesh(
            new BoxGeometry(1, 1, 1),
            new MeshBasicMaterial({ color: "gold" })
        );

        moveObject(mesh);

        scaleObject(mesh);

        rotateObject(mesh);

        app.scene.add(mesh);
    }, [setUpCamera]);


    useEffect(() =>
    {
        initScene();

        app.showStatus();

        app.addArrowHelper();

    }, [initScene]);

    return (
        <div ref={container} id='container'>

        </div>
    );
}
