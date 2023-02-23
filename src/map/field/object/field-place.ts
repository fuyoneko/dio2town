import * as THREE from 'three';
import { Plane } from './plane';
import { GeoPoint } from './geo-point';
import { LabelTexture } from './label-texture';
import { Color } from '../../util/color';
import { FieldObjectBase } from './field-object-base';
import { SpritePanel } from './sprite-panel';
import type { DioData } from '../../../map/parser/dio-data';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import * as polygon from '../../../polygon/polygon.json';
import { FieldPlaceBuildingObject } from './field-place-build-object';
import { GeoRectangle } from './geo-rectangle';
import { LabelPlate } from './label-plate';

/** 平面のマップ部品を描画する */
export class FieldPlace extends FieldObjectBase {
  // スプライト表示をする詳細情報
  _spritePanel: SpritePanel | null;
  // LOD2相当で表示する簡単なビルディング
  _buildingObject: FieldPlaceBuildingObject;
  // オブジェクトの空間情報
  _objectSpace: GeoRectangle;

  /** コンストラクタ */
  constructor(scene: THREE.Scene, data: DioData) {
    super();
    // 建物情報を登録する
    this._buildingObject = new FieldPlaceBuildingObject();
    // オブジェクトの表示スペースを設定する
    this._objectSpace = new GeoRectangle(
      new GeoPoint(data.x[0], data.y[0]),
      new GeoPoint(data.x[1], data.y[1])
    );
    // 建物（扁平なタイルを表示する）
    const base = Plane.drawPlane(
      scene,
      this._objectSpace.p1,
      this._objectSpace.p2,
      0.01,
      Color.lightGrey
    );
    if (data.invisible) {
      base.material.visible = false;
    } else {
      // タイルの上にテクスチャを表示する
      const plate = new LabelPlate({
        x1: data.x[0],
        x2: data.x[1],
        z1: data.y[0],
        z2: data.y[1],
        y: 0.01 + 0.001,
        label: data.label,
        fontSize: data.fontSize,
        backgroundColor: Color.lightGrey,
      });
      scene.add(plate.plane);
      scene.add(plate.basement);
      this.addBoundingBox(plate.basement);

      // 選択中ハイライトを設定する
      this.initOverlay(
        scene,
        new GeoPoint(data.x[0], data.y[0]),
        new GeoPoint(data.x[1], data.y[1]),
        0.01 + 0.003
      );
      // ホバー中のホバー表示を設定する
      this.initHover(
        scene,
        new GeoPoint(data.x[0], data.y[0]),
        new GeoPoint(data.x[1], data.y[1]),
        0.01 + 0.003
      );

      // Lazy Load用の簡単なビルディングを取得する
      /*
      if (data.lod2.length >= 1 && data.lod2 in polygon) {
        this._buildingObject = this.createBuildingObject(scene, data);
        this._buildingObject.accessToLazyLoadBuilding((_, sprite) => {
          this.addBoundingBox(sprite);
        });
      }
      */
    }

    if (data.image) {
      const panel = new SpritePanel(scene, data.image);
      panel.setPosition(base.plane.position.x, base.plane.position.z);
      this._spritePanel = panel;
    } else {
      this._spritePanel = null;
    }
  }

  /** スプライトオブジェクトとしてテキストラベルを作成する */
  createSpliteLabel(data: DioData) {
    // ラベルが不要なら作成しない
    if (data.label.length == 0) {
      const empty = new THREE.Sprite();
      empty.scale.set(0, 0, 0);
      return empty;
    }
    // ラベルのサイズ情報を取得する
    const labelInfo = LabelTexture.contextMeasureText(data.label, 12);
    const labelHeight = 0.02;
    const labelAcept =
      labelInfo.actualBoundingBoxAscent >= 0.01
        ? labelInfo.width / labelInfo.actualBoundingBoxAscent
        : 1.0;
    // ラベルを作成する
    const texture = LabelTexture.createLabelCanvas(
      data.label,
      {
        width: labelHeight * labelAcept,
        height: labelHeight,
        fontSize: 10,
        foregroundColor: Color.white,
        backgroundColor: Color.darkGrey,
      },
      () => 'yoko'
    );
    // 背景データを表示する
    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(texture),
    });
    material.opacity = 1.0;
    material.depthTest = false;
    // スプライトオブジェクトとして返却する
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(labelHeight * labelAcept, labelHeight, 1.0);
    return sprite;
  }

  /** ピッチが下がった時に表示する詳細ビュー（オブジェクト）を設定する */
  createBuildingObject(scene: THREE.Scene, data: DioData) {
    // 中心座標を取得する
    const mx = (data.x[0] + data.x[1]) / 2;
    const my = (data.y[0] + data.y[1]) / 2;
    // ダミーの3Dオブジェクトを作成する（GLB読み込み完了後にリプレイスされる）
    const building = Plane.drawPlane(
      scene,
      new GeoPoint(data.x[0], data.y[0]),
      new GeoPoint(data.x[1], data.y[1]),
      0.04,
      Color.lightGrey
    ).plane;
    // スプライトオブジェクト（テキストラベル）を作成する
    const sprite = this.createSpliteLabel(data);
    sprite.position.set(mx, 0.03, my);
    scene.add(sprite);
    // 非表示にする
    building.visible = false;
    sprite.visible = false;
    // オブジェクトを返す
    const result = new FieldPlaceBuildingObject().withContents(
      building,
      sprite
    );
    /*
    // GLBデータからオブジェクトを取得する
    const loader = new GLTFLoader();
    loader.parse(
      result.base64ToArrayBuffer(polygon[data.lod2].glb),
      '/',
      gltf => {
        // 四角形のオブジェクトと入れ替える
        result.replaceLazyLoadBuilding(
          scene,
          gltf.scene,
          polygon[data.lod2].scale,
          polygon[data.lod2].rotate,
          polygon[data.lod2].y
        );
      }
    );
    */
    return result;
  }

  /** ピッチの状態に応じて、詳細ビューの表示状態を更新する */
  didUpdateCameraStatus(
    polarAngle: number,
    azimuthalAngle: number,
    distance: number,
    cameraPosition: THREE.Vector3
  ): void {
    // 表示状態の期待値を設定する
    let scale = 0; // 拡大率（ピッチが十分に下がっていれば1.0）
    let visible = false; // 表示/非表示（ピッチが十分に下がっていれば表示）
    if (polarAngle >= 60) {
      scale = Math.min(polarAngle - 60, 5) / 5;
      scale *= this._buildingObject.lazyLoadBuildingScale;
      visible = true;
    }
    // カメラと衝突していれば表示状態を変更する
    if (visible) {
      if (this._objectSpace.isIntersect(cameraPosition.x, cameraPosition.z)) {
        visible = false;
      }
    }
    // 表示状態の期待値を反映する
    this._buildingObject.accessToLazyLoadBuilding((building, sprite) => {
      if (building.scale.x != scale) {
        building.scale.set(scale, scale, scale);
      }
      if (building.visible != visible) {
        building.visible = visible;
        sprite.visible = visible;
      }
    });
  }

  /** 選択状態を更新、オーバレイ表示する */
  showOverlay(): void {
    super.showOverlay();
    if (this._spritePanel) {
      this._spritePanel.show();
    }
  }

  /** オーバレイ表示を終了する */
  hideOverlay(): void {
    super.hideOverlay();
    if (this._spritePanel) {
      this._spritePanel.hide();
    }
  }
}
