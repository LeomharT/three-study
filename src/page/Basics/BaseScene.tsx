import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from "react";
import { AmbientLight, BufferGeometry, CatmullRomCurve3, Color, DirectionalLight, LineBasicMaterial, LineLoop, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier';
import { app } from "../../app/application-service";
import useScene from "../../hooks/useScene";

export default function BaseScene()
{
    const domEl: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    let flow: MutableRefObject<Flow | null> = useRef<Flow | null>(null);

    const createText: () => Promise<Mesh> = useCallback(async (): Promise<Mesh> =>
    {
        const h_regular = '/data/helvetiker_regular.typeface.json';

        const font = await new FontLoader().loadAsync(h_regular);

        const text = new TextGeometry('FIRST SCENE', {
            font,
            size: 60,
            height: 15,
            curveSegments: 6,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 50
        });

        text.rotateX(Math.PI);

        const mesh = new Mesh(
            text,
            new MeshStandardMaterial({ color: 0x99ffff, })
        );

        return mesh;
    }, []);

    const addLigth = useCallback(() =>
    {
        const direc_light = new DirectionalLight(0xffaa33);
        direc_light.position.set(- 10, 10, 10);
        direc_light.intensity = 1.3;
        app.scene.add(direc_light);

        const ambient_light = new AmbientLight(0x003973);
        ambient_light.intensity = 1.3;
        app.scene.add(ambient_light);
    }, []);

    const textMoveAloneCurve = useCallback(async () =>
    {
        const initialPoints = [
            new Vector3(200, 0, -200),
            new Vector3(200, 0, 200),
            new Vector3(-200, 0, 200),
            new Vector3(-200, 0, -200),
        ];

        const curve: CatmullRomCurve3 = new CatmullRomCurve3(initialPoints);

        curve.type = 'centripetal';

        //@ts-ignore
        curve.closed = true;

        const points = curve.getPoints(50);

        const line = new LineLoop(
            new BufferGeometry().setFromPoints(points),
            new LineBasicMaterial({ color: 0x00ff00 })
        );

        app.scene.add(line);

        const text = await createText();

        flow.current = new Flow(text);
        flow.current.updateCurve(0, curve);

        app.scene.add(flow.current.object3D);
    }, [createText]);

    useScene(domEl);

    useEffect(() =>
    {
        app.addArrowHelper();

        app.scene.background = new Color(0xE8E8E8);

        addLigth();

        textMoveAloneCurve();

        app.injectFunction = (time: number) =>
        {
            if (flow.current)
            {
                flow.current.moveAlongCurve(0.001);
            }
        };

    }, [addLigth, textMoveAloneCurve]);

    return (
        <div ref={domEl}></div>
    );
}
