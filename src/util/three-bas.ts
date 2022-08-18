import { BufferGeometry, Face, Vector3 } from "three";

/** 计算中心点 */
export function computeCentroid(geometry: BufferGeometry, face: Face, v: Vector3)
{
    // [x,y,z,x,y,z...]
    const positions = geometry.getAttribute("position").array;

    //返回个数3个为一组
    const vertexCount = geometry.getAttribute('position').count;

    v = v || new Vector3();

}
