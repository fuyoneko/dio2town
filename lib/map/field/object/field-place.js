"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldPlace = void 0;
const THREE = require("three");
const plane_1 = require("./plane");
const geo_point_1 = require("./geo-point");
const label_texture_1 = require("./label-texture");
const color_1 = require("../../util/color");
const field_object_base_1 = require("./field-object-base");
const sprite_panel_1 = require("./sprite-panel");
// import * as polygon from '../../../polygon/polygon.json';
const field_place_build_object_1 = require("./field-place-build-object");
const geo_rectangle_1 = require("./geo-rectangle");
const label_plate_1 = require("./label-plate");
/** 平面のマップ部品を描画する */
class FieldPlace extends field_object_base_1.FieldObjectBase {
    /** コンストラクタ */
    constructor(scene, data) {
        super();
        // 建物情報を登録する
        this._buildingObject = new field_place_build_object_1.FieldPlaceBuildingObject();
        // オブジェクトの表示スペースを設定する
        this._objectSpace = new geo_rectangle_1.GeoRectangle(new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]));
        // 建物（扁平なタイルを表示する）
        const base = plane_1.Plane.drawPlane(scene, this._objectSpace.p1, this._objectSpace.p2, 0.01, color_1.Color.lightGrey);
        if (data.invisible) {
            base.material.visible = false;
        }
        else {
            // タイルの上にテクスチャを表示する
            const plate = new label_plate_1.LabelPlate({
                x1: data.x[0],
                x2: data.x[1],
                z1: data.y[0],
                z2: data.y[1],
                y: 0.01 + 0.001,
                label: data.label,
                fontSize: data.fontSize,
                backgroundColor: color_1.Color.lightGrey,
            });
            scene.add(plate.plane);
            scene.add(plate.basement);
            this.addBoundingBox(plate.basement);
            // 選択中ハイライトを設定する
            this.initOverlay(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), 0.01 + 0.003);
            // ホバー中のホバー表示を設定する
            this.initHover(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), 0.01 + 0.003);
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
            const panel = new sprite_panel_1.SpritePanel(scene, data.image);
            panel.setPosition(base.plane.position.x, base.plane.position.z);
            this._spritePanel = panel;
        }
        else {
            this._spritePanel = null;
        }
    }
    /** スプライトオブジェクトとしてテキストラベルを作成する */
    createSpliteLabel(data) {
        // ラベルが不要なら作成しない
        if (data.label.length == 0) {
            const empty = new THREE.Sprite();
            empty.scale.set(0, 0, 0);
            return empty;
        }
        // ラベルのサイズ情報を取得する
        const labelInfo = label_texture_1.LabelTexture.contextMeasureText(data.label, 12);
        const labelHeight = 0.02;
        const labelAcept = labelInfo.actualBoundingBoxAscent >= 0.01
            ? labelInfo.width / labelInfo.actualBoundingBoxAscent
            : 1.0;
        // ラベルを作成する
        const texture = label_texture_1.LabelTexture.createLabelCanvas(data.label, {
            width: labelHeight * labelAcept,
            height: labelHeight,
            fontSize: 10,
            foregroundColor: color_1.Color.white,
            backgroundColor: color_1.Color.darkGrey,
        }, () => 'yoko');
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
    createBuildingObject(scene, data) {
        // 中心座標を取得する
        const mx = (data.x[0] + data.x[1]) / 2;
        const my = (data.y[0] + data.y[1]) / 2;
        // ダミーの3Dオブジェクトを作成する（GLB読み込み完了後にリプレイスされる）
        const building = plane_1.Plane.drawPlane(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), 0.04, color_1.Color.lightGrey).plane;
        // スプライトオブジェクト（テキストラベル）を作成する
        const sprite = this.createSpliteLabel(data);
        sprite.position.set(mx, 0.03, my);
        scene.add(sprite);
        // 非表示にする
        building.visible = false;
        sprite.visible = false;
        // オブジェクトを返す
        const result = new field_place_build_object_1.FieldPlaceBuildingObject().withContents(building, sprite);
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
    didUpdateCameraStatus(polarAngle, azimuthalAngle, distance, cameraPosition) {
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
    showOverlay() {
        super.showOverlay();
        if (this._spritePanel) {
            this._spritePanel.show();
        }
    }
    /** オーバレイ表示を終了する */
    hideOverlay() {
        super.hideOverlay();
        if (this._spritePanel) {
            this._spritePanel.hide();
        }
    }
}
exports.FieldPlace = FieldPlace;
