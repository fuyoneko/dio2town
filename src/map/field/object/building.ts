import { Plane } from './plane';
import { GeoPoint } from './geo-point';
import { Color } from '../../util/color';
import { FieldObjectBase } from './field-object-base';
import type { DioData } from '../../../map/parser/dio-data';
import { LabelPlate } from './label-plate';
import * as THREE from "three";

const BUILDING_HEIGHT = 0.05;

/**
 * 立体の建物を作成する
 * type : building
 */
export class Building extends FieldObjectBase {
  /**
   * コンストラクタ
   *
   * @param scene - シーンオブジェクト
   * @param data - Draw.ioのデータオブジェクト
   */
  constructor(scene: THREE.Scene, data: DioData) {
    super();

    // オブジェクトを作成する
    Plane.drawPlane(
      scene,
      new GeoPoint(data.x[0], data.y[0]),
      new GeoPoint(data.x[1], data.y[1]),
      BUILDING_HEIGHT,
      Color.buildingBase
    );
    // テキストラベルを追加する
    const plate = new LabelPlate({
      x1: data.x[0],
      x2: data.x[1],
      z1: data.y[0],
      z2: data.y[1],
      y: BUILDING_HEIGHT + 0.001,
      label: data.label,
      fontSize: data.fontSize,
      backgroundColor: Color.lightGrey,
    });
    scene.add(plate.plane);
    scene.add(plate.basement);
    this.addBoundingBox(plate.basement);

    // オーバーレイの選択時表示を追加する
    this.initOverlay(
      scene,
      new GeoPoint(data.x[0], data.y[0]),
      new GeoPoint(data.x[1], data.y[1]),
      BUILDING_HEIGHT + 0.003
    );
    // ホバーのホバー中ハイライトを追加する
    this.initHover(
      scene,
      new GeoPoint(data.x[0], data.y[0]),
      new GeoPoint(data.x[1], data.y[1]),
      BUILDING_HEIGHT + 0.003
    );
  }
}
