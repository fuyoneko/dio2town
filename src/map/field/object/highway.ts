import type { DioData } from '../../../map/parser/dio-data';
import { Color } from '../../../map/util/color';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { FieldObjectBase } from './field-object-base';
import { GeoPoint } from './geo-point';
import { Plane } from './plane';

/** 高速道路を管理するオブジェクト */
export class Highway extends FieldObjectBase {
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
  constructor(scene: THREE.Scene, data: DioData, minX, minY, maxX, maxY) {
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
    const roadColor = Color.darkGrey;
    const guardHeight = 0.025;

    const degToRad = (deg: number) => {
      return Math.PI * 2 * (deg / 360.0);
    };

    const roadDrawing = () => {
      const degreeToPos = (
        degree: number,
        height: number,
        distance: number
      ) => {
        const xpos = xFromTo[0] + distance * Math.cos(degToRad(degree));
        const zpos = zFromTo[0] + distance * Math.sin(degToRad(degree));
        return [xpos, height, zpos];
      };
      const direct = (x: number, y: number, z: number) => {
        return [x, y, z];
      };
      const rectangleToMapping = (
        a: Vector3,
        b: Vector3,
        c: Vector3,
        d: Vector3,
        converter: (x: number, y: number, z: number) => number[] = degreeToPos
      ) => {
        return [
          ...converter(b.x, b.y, b.z), // B
          ...converter(a.x, a.y, a.z), // A
          ...converter(c.x, c.y, c.z), // C
          //
          ...converter(c.x, c.y, c.z), // C
          ...converter(a.x, a.y, a.z), // A
          ...converter(d.x, d.y, d.z), // D
        ];
      };

      const verts: number[] = [];
      // 直線部分の側壁を描画する
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight - guardHeight,
            zFromTo[0]
          ),
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight - guardHeight,
            zFromTo[1]
          ),
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight + guardHeight,
            zFromTo[1]
          ),
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight + guardHeight,
            zFromTo[0]
          ),
          direct
        )
      );
      // 直線部分を描画する
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight,
            zFromTo[0]
          ),
          new Vector3(
            xCenter - (yParameter + roadWidth),
            floorHeight,
            zFromTo[1]
          ),
          new Vector3(xCenter - yParameter, floorHeight, zFromTo[1]),
          new Vector3(xCenter - yParameter, floorHeight, zFromTo[0]),
          direct
        )
      );
      // 直線部分の側壁を描画する
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xCenter - yParameter,
            floorHeight - guardHeight,
            zFromTo[0]
          ),
          new Vector3(
            xCenter - yParameter,
            floorHeight - guardHeight,
            zFromTo[1]
          ),
          new Vector3(
            xCenter - yParameter,
            floorHeight + guardHeight,
            zFromTo[1]
          ),
          new Vector3(
            xCenter - yParameter,
            floorHeight + guardHeight,
            zFromTo[0]
          ),
          direct
        )
      );
      // 曲線部分を描画する
      for (let i = 0; i < 22; i++) {
        const angleStart = (90.0 / 22) * i;
        const angleEnd = (90.0 / 22) * (i + 1);
        // アスファルトを描画する
        verts.push(
          ...rectangleToMapping(
            new Vector3(90.0 + angleStart, floorHeight, yParameter),
            new Vector3(90.0 + angleStart, floorHeight, yParameter + roadWidth),
            new Vector3(90.0 + angleEnd, floorHeight, yParameter + roadWidth),
            new Vector3(90.0 + angleEnd, floorHeight, yParameter)
          )
        );
        // 側壁を描画する
        verts.push(
          ...rectangleToMapping(
            new Vector3(
              90.0 + angleStart,
              floorHeight - guardHeight,
              yParameter
            ),
            new Vector3(90.0 + angleEnd, floorHeight - guardHeight, yParameter),
            new Vector3(90.0 + angleEnd, floorHeight + guardHeight, yParameter),
            new Vector3(
              90.0 + angleStart,
              floorHeight + guardHeight,
              yParameter
            )
          )
        );
        // 側壁を描画する
        verts.push(
          ...rectangleToMapping(
            new Vector3(
              90.0 + angleStart,
              floorHeight - guardHeight,
              yParameter + roadWidth
            ),
            new Vector3(
              90.0 + angleEnd,
              floorHeight - guardHeight,
              yParameter + roadWidth
            ),
            new Vector3(
              90.0 + angleEnd,
              floorHeight + guardHeight,
              yParameter + roadWidth
            ),
            new Vector3(
              90.0 + angleStart,
              floorHeight + guardHeight,
              yParameter + roadWidth
            )
          )
        );
      }
      // 直線部分を描画する
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xFromTo[0],
            floorHeight,
            zCenter + yParameter + roadWidth
          ),
          new Vector3(
            xFromTo[1],
            floorHeight,
            zCenter + yParameter + roadWidth
          ),
          new Vector3(xFromTo[1], floorHeight, zCenter + yParameter),
          new Vector3(xFromTo[0], floorHeight, zCenter + yParameter),
          direct
        )
      );
      // 側壁を描画する
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xFromTo[0],
            floorHeight - guardHeight,
            zCenter + yParameter + roadWidth
          ),
          new Vector3(
            xFromTo[1],
            floorHeight - guardHeight,
            zCenter + yParameter + roadWidth
          ),
          new Vector3(
            xFromTo[1],
            floorHeight + guardHeight,
            zCenter + yParameter + roadWidth
          ),
          new Vector3(
            xFromTo[0],
            floorHeight + guardHeight,
            zCenter + yParameter + roadWidth
          ),
          direct
        )
      );
      verts.push(
        ...rectangleToMapping(
          new Vector3(
            xFromTo[0],
            floorHeight - guardHeight,
            zCenter + yParameter
          ),
          new Vector3(
            xFromTo[1],
            floorHeight - guardHeight,
            zCenter + yParameter
          ),
          new Vector3(
            xFromTo[1],
            floorHeight + guardHeight,
            zCenter + yParameter
          ),
          new Vector3(
            xFromTo[0],
            floorHeight + guardHeight,
            zCenter + yParameter
          ),
          direct
        )
      );
      // メモリに格納した頂点を描画する
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(verts), 3)
      );
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: roadColor.asInteger,
          side: THREE.DoubleSide,
        })
      );

      scene.add(mesh);
    };
    roadDrawing();

    // ラベルを描画する
    Plane.drawTexturePlane(
      scene,
      data.label,
      new GeoPoint(
        xLabelPosition - labelHeight / 2,
        (zFromTo[0] + zFromTo[1]) / 2 + labelWidth
      ),
      new GeoPoint(
        xLabelPosition + labelHeight / 2,
        (zFromTo[0] + zFromTo[1]) / 2
      ),
      floorHeight + labelYPosition,
      25
    );
  }
}

export default Highway;
