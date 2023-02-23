"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const plane_1 = require("./plane");
const geo_point_1 = require("./geo-point");
const color_1 = require("../../util/color");
const field_object_base_1 = require("./field-object-base");
const label_plate_1 = require("./label-plate");
const BUILDING_HEIGHT = 0.05;
/**
 * 立体の建物を作成する
 * type : building
 */
class Building extends field_object_base_1.FieldObjectBase {
    /**
     * コンストラクタ
     *
     * @param scene - シーンオブジェクト
     * @param data - Draw.ioのデータオブジェクト
     */
    constructor(scene, data) {
        super();
        // オブジェクトを作成する
        plane_1.Plane.drawPlane(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), BUILDING_HEIGHT, color_1.Color.buildingBase);
        // テキストラベルを追加する
        const plate = new label_plate_1.LabelPlate({
            x1: data.x[0],
            x2: data.x[1],
            z1: data.y[0],
            z2: data.y[1],
            y: BUILDING_HEIGHT + 0.001,
            label: data.label,
            fontSize: data.fontSize,
            backgroundColor: color_1.Color.lightGrey,
        });
        scene.add(plate.plane);
        scene.add(plate.basement);
        this.addBoundingBox(plate.basement);
        // オーバーレイの選択時表示を追加する
        this.initOverlay(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), BUILDING_HEIGHT + 0.003);
        // ホバーのホバー中ハイライトを追加する
        this.initHover(scene, new geo_point_1.GeoPoint(data.x[0], data.y[0]), new geo_point_1.GeoPoint(data.x[1], data.y[1]), BUILDING_HEIGHT + 0.003);
    }
}
exports.Building = Building;
