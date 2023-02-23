"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Highway = void 0;
const color_1 = require("../../../map/util/color");
const THREE = require("three");
const three_1 = require("three");
const field_object_base_1 = require("./field-object-base");
const geo_point_1 = require("./geo-point");
const plane_1 = require("./plane");
/** 高速道路を管理するオブジェクト */
class Highway extends field_object_base_1.FieldObjectBase {
    /**
     * 高速道路を追加する
     *
     * @param scene - シーンオブジェクト
     * @param data - DrawIoから取得したデータ
     * @param minX - number : 高速道路の表示クリッピングエリアの最小X
     * @param minY - number : 高速道路の表示クリッピングエリアの最小Z
     * @param maxX - number : 高速道路の表示クリッピングエリアの最大X
     * @param maxY - number : 高速道路の表示クリッピングエリアの最大Z
     */
    constructor(scene, data, minX, minY, maxX, maxY) {
        super();
        // 床の高さ
        const floorHeight = 0.1;
        // 道幅
        const roadWidth = 0.1;
        // 中心座標
        const zCenter = (data.y[0] + data.y[1]) / 2;
        const xCenter = (data.x[0] + data.x[1]) / 2; // -0.04;
        // 円の大きさ
        const yParameter = Math.abs(data.x[0] - data.x[1]) / 2;
        // Zの開始点
        const zFromTo = [zCenter, minY];
        // xの開始点
        const xFromTo = [xCenter, maxX];
        // ラベル位置
        const xLabelPosition = xCenter - (yParameter + roadWidth / 2);
        // ラベルの大きさ
        const labelWidth = 0.4;
        const labelHeight = 0.06;
        const labelYPosition = 0.01;
        // 色
        const roadColor = color_1.Color.darkGrey;
        const guardHeight = 0.025;
        const degToRad = (deg) => {
            return Math.PI * 2 * (deg / 360.0);
        };
        const roadDrawing = () => {
            const degreeToPos = (degree, height, distance) => {
                const xpos = xFromTo[0] + distance * Math.cos(degToRad(degree));
                const zpos = zFromTo[0] + distance * Math.sin(degToRad(degree));
                return [xpos, height, zpos];
            };
            const direct = (x, y, z) => {
                return [x, y, z];
            };
            const rectangleToMapping = (a, b, c, d, converter = degreeToPos) => {
                return [
                    ...converter(b.x, b.y, b.z),
                    ...converter(a.x, a.y, a.z),
                    ...converter(c.x, c.y, c.z),
                    //
                    ...converter(c.x, c.y, c.z),
                    ...converter(a.x, a.y, a.z),
                    ...converter(d.x, d.y, d.z), // D
                ];
            };
            const verts = [];
            // 直線部分の側壁を描画する
            verts.push(...rectangleToMapping(new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight - guardHeight, zFromTo[0]), new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight - guardHeight, zFromTo[1]), new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight + guardHeight, zFromTo[1]), new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight + guardHeight, zFromTo[0]), direct));
            // 直線部分を描画する
            verts.push(...rectangleToMapping(new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight, zFromTo[0]), new three_1.Vector3(xCenter - (yParameter + roadWidth), floorHeight, zFromTo[1]), new three_1.Vector3(xCenter - yParameter, floorHeight, zFromTo[1]), new three_1.Vector3(xCenter - yParameter, floorHeight, zFromTo[0]), direct));
            // 直線部分の側壁を描画する
            verts.push(...rectangleToMapping(new three_1.Vector3(xCenter - yParameter, floorHeight - guardHeight, zFromTo[0]), new three_1.Vector3(xCenter - yParameter, floorHeight - guardHeight, zFromTo[1]), new three_1.Vector3(xCenter - yParameter, floorHeight + guardHeight, zFromTo[1]), new three_1.Vector3(xCenter - yParameter, floorHeight + guardHeight, zFromTo[0]), direct));
            // 曲線部分を描画する
            for (let i = 0; i < 22; i++) {
                const angleStart = (90.0 / 22) * i;
                const angleEnd = (90.0 / 22) * (i + 1);
                // アスファルトを描画する
                verts.push(...rectangleToMapping(new three_1.Vector3(90.0 + angleStart, floorHeight, yParameter), new three_1.Vector3(90.0 + angleStart, floorHeight, yParameter + roadWidth), new three_1.Vector3(90.0 + angleEnd, floorHeight, yParameter + roadWidth), new three_1.Vector3(90.0 + angleEnd, floorHeight, yParameter)));
                // 側壁を描画する
                verts.push(...rectangleToMapping(new three_1.Vector3(90.0 + angleStart, floorHeight - guardHeight, yParameter), new three_1.Vector3(90.0 + angleEnd, floorHeight - guardHeight, yParameter), new three_1.Vector3(90.0 + angleEnd, floorHeight + guardHeight, yParameter), new three_1.Vector3(90.0 + angleStart, floorHeight + guardHeight, yParameter)));
                // 側壁を描画する
                verts.push(...rectangleToMapping(new three_1.Vector3(90.0 + angleStart, floorHeight - guardHeight, yParameter + roadWidth), new three_1.Vector3(90.0 + angleEnd, floorHeight - guardHeight, yParameter + roadWidth), new three_1.Vector3(90.0 + angleEnd, floorHeight + guardHeight, yParameter + roadWidth), new three_1.Vector3(90.0 + angleStart, floorHeight + guardHeight, yParameter + roadWidth)));
            }
            // 直線部分を描画する
            verts.push(...rectangleToMapping(new three_1.Vector3(xFromTo[0], floorHeight, zCenter + yParameter + roadWidth), new three_1.Vector3(xFromTo[1], floorHeight, zCenter + yParameter + roadWidth), new three_1.Vector3(xFromTo[1], floorHeight, zCenter + yParameter), new three_1.Vector3(xFromTo[0], floorHeight, zCenter + yParameter), direct));
            // 側壁を描画する
            verts.push(...rectangleToMapping(new three_1.Vector3(xFromTo[0], floorHeight - guardHeight, zCenter + yParameter + roadWidth), new three_1.Vector3(xFromTo[1], floorHeight - guardHeight, zCenter + yParameter + roadWidth), new three_1.Vector3(xFromTo[1], floorHeight + guardHeight, zCenter + yParameter + roadWidth), new three_1.Vector3(xFromTo[0], floorHeight + guardHeight, zCenter + yParameter + roadWidth), direct));
            verts.push(...rectangleToMapping(new three_1.Vector3(xFromTo[0], floorHeight - guardHeight, zCenter + yParameter), new three_1.Vector3(xFromTo[1], floorHeight - guardHeight, zCenter + yParameter), new three_1.Vector3(xFromTo[1], floorHeight + guardHeight, zCenter + yParameter), new three_1.Vector3(xFromTo[0], floorHeight + guardHeight, zCenter + yParameter), direct));
            // メモリに格納した頂点を描画する
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));
            geometry.computeVertexNormals();
            const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
                color: roadColor.asInteger,
                side: THREE.DoubleSide,
            }));
            scene.add(mesh);
        };
        roadDrawing();
        // ラベルを描画する
        plane_1.Plane.drawTexturePlane(scene, data.label, new geo_point_1.GeoPoint(xLabelPosition - labelHeight / 2, (zFromTo[0] + zFromTo[1]) / 2 + labelWidth), new geo_point_1.GeoPoint(xLabelPosition + labelHeight / 2, (zFromTo[0] + zFromTo[1]) / 2), floorHeight + labelYPosition, 25);
    }
}
exports.Highway = Highway;
exports.default = Highway;
