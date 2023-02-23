import * as THREE from 'three';
import { GeoPoint } from './object/geo-point';
import { Plane } from './object/plane';
import { Building } from './object/building';
import { Color } from '../util/color';
import { FieldPlace } from './object/field-place';
import { FieldObjectBase } from './object/field-object-base';
import { Vector3 } from 'three';
import { Highway } from './object/highway';
/**
 * Comment
 */
export class MainField {
    /** */
    constructor() {
        this._fieldObjectList = [];
        this._fieldObjectList = [];
    }
    /** 壁を追加する */
    addWall(scene, minX, minY, maxX, maxY) {
        const geometry = new THREE.PlaneGeometry(1.2, 0.2);
        const material = new THREE.MeshBasicMaterial();
        const plane = new THREE.Mesh(geometry, material);
        plane.translateY(0.1);
        plane.translateZ(0.1);
        plane.translateX(maxX - 0.001);
        plane.rotateY(-Math.PI * 0.5);
        scene.add(plane);
        // テクスチャを遅延読み込みする
        new THREE.TextureLoader()
            .loadAsync('/images/east-wall-center.png')
            .then(texture => {
            material.map = texture;
            material.needsUpdate = true;
        });
        const boundaries = [
            // 時計台側
            { t: new Vector3(maxX, 0.2, minY), f: new Vector3(maxX, 0.0, maxY) },
            // 北門側
            { t: new Vector3(minX, 0.2, minY), f: new Vector3(maxX, 0.0, minY) },
            // 南側
            { f: new Vector3(minX, 0.0, maxY), t: new Vector3(maxX, 0.2, maxY) },
            // 商店街側
            { f: new Vector3(minX, 0.0, minY), t: new Vector3(minX, 0.2, maxY) },
        ];
        for (const bounds of boundaries) {
            const f = bounds.f;
            const t = bounds.t;
            const bf = new THREE.BufferGeometry();
            bf.setFromPoints([
                new Vector3(f.x, f.y, f.z),
                new Vector3(f.x, t.y, f.z),
                new Vector3(t.x, f.y, t.z),
                new Vector3(t.x, t.y, t.z),
            ]);
            bf.setIndex([0, 1, 2, 2, 1, 3]);
            const wallMaterial = new THREE.MeshBasicMaterial({
                color: 0x333,
                opacity: 0.25,
                side: THREE.FrontSide,
                transparent: true,
                depthTest: true,
            });
            scene.add(new THREE.Mesh(bf, wallMaterial));
        }
    }
    /**
     * ラベルにハイライトを設定する
     *
     * @param label - 選択されたラベルのテキスト
     */
    highlightWithLabel(label) {
        this._fieldObjectList.forEach(item => {
            if (item.label == label) {
                item.showOverlay();
            }
            else {
                item.hideOverlay();
            }
        });
    }
    /**
     * ラベルにホバーを設定する
     *
     * @param label - ホバーされたラベルのテキスト
     */
    hoverWithLabel(label) {
        this._fieldObjectList.forEach(item => {
            if (item.label == label) {
                item.showHover();
            }
            else {
                item.hideHover();
            }
        });
    }
    /**
     * ラベルにハイライトを設定する
     *
     * @param index - 選択されたインデックス
     */
    highlightWithIndex(index) {
        this._fieldObjectList.forEach(item => {
            if (index.includes(item.index)) {
                item.showOverlay();
            }
            else {
                item.hideOverlay();
            }
        });
    }
    /** イテレータを元に、対象のラベルを返却する */
    labelFromIterator(iterator) {
        const result = this._fieldObjectList.filter(item => item.iterator == iterator);
        if (result && result.length >= 1) {
            return result[0].label;
        }
        return null;
    }
    /** ハイライトの状態を初期化する */
    clearHighlight() {
        this._fieldObjectList.forEach(item => {
            item.hideOverlay();
        });
    }
    /** ホバー状態を初期化する */
    clearHover() {
        this._fieldObjectList.forEach(item => {
            item.hideHover();
        });
    }
    /** カメラの状態が更新された */
    didUpdateCameraStatus(polarAngle, azimuthalAngle, distance, cameraPosition) {
        this._fieldObjectList.forEach(item => {
            item.didUpdateCameraStatus(polarAngle, azimuthalAngle, distance, cameraPosition);
        });
    }
    /** Dioをもとに、データを初期化する */
    basement(scene, dioData, progress) {
        // 床の情報を取得する
        let floorPositionMin = new GeoPoint(0, 0);
        let floorPositionMax = new GeoPoint(1, 1);
        dioData.data.forEach(data => {
            if (data.type == 'floor') {
                floorPositionMin = new GeoPoint(data.x[0], data.y[0]);
                floorPositionMax = new GeoPoint(data.x[1], data.y[1]);
            }
        });
        // 各オブジェクトを作成する
        this._fieldObjectList = dioData.data.map((data, index) => {
            // 進捗状態を報告する
            progress(index, dioData.data.length);
            // オブジェクトを作成する
            let result = new FieldObjectBase();
            // オブジェクト：高速道路を作成する
            if (data.type == 'highway') {
                new Highway(scene, data, floorPositionMin.x, floorPositionMin.z, floorPositionMax.x, floorPositionMax.z);
            }
            // オブジェクト：床を作成する
            if (data.type == 'floor') {
                this.addWall(scene, data.x[0], data.y[0], data.x[1], data.y[1]);
                Plane.drawPlane(scene, new GeoPoint(data.x[0], data.y[0]), new GeoPoint(data.x[1], data.y[1]), 0.005, Color.floorBase);
            }
            if (data.type == 'x-street' || data.type == 'y-street') {
                const plane = Plane.drawPlane(scene, new GeoPoint(data.x[0], data.y[0]), new GeoPoint(data.x[1], data.y[1]));
                if (data.rotate) {
                    plane.plane.rotateY(Math.PI * (-data.rotate / 180.0));
                }
                if (data.height) {
                    plane.plane.translateY(data.height);
                }
            }
            // オブジェクト：道の上のラベルを作成する
            if (data.type == 'street-label') {
                const plane = Plane.drawTexturePlane(scene, data.label, new GeoPoint(data.x[0], data.y[0]), new GeoPoint(data.x[1], data.y[1]), 0.01 + 0.005, data.fontSize);
                plane.userData = {
                    clickable: true,
                    type: 'street-label',
                    label: data.label,
                };
            }
            // オブジェクト：アーケードの道を作成する
            if (data.type == 'x-street-store') {
                const plane = Plane.drawPlane(scene, new GeoPoint(data.x[0], data.y[0]), new GeoPoint(data.x[1], data.y[1]));
                if (data.rotate) {
                    plane.plane.rotateY(Math.PI * (-data.rotate / 180.0));
                }
                const arcade = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, Math.abs(data.x[0] - data.x[1]), 20, 1, true, Math.PI * 0.0, Math.PI * 1), new THREE.MeshStandardMaterial({ color: 0x666666 }));
                arcade.translateX(plane.plane.position.x);
                arcade.translateZ(plane.plane.position.z);
                arcade.translateY(0.02);
                arcade.rotateZ(Math.PI * 0.5);
                scene.add(arcade);
            }
            // オブジェクト：アーケードの道を作成する
            if (data.type == 'y-street-store') {
                const plane = Plane.drawPlane(scene, new GeoPoint(data.x[0], data.y[0]), new GeoPoint(data.x[1], data.y[1]));
                if (data.rotate) {
                    plane.plane.rotateY(Math.PI * (-data.rotate / 180.0));
                }
                const arcade = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, Math.abs(data.y[0] - data.y[1]), 20, 1, true, Math.PI * 0.5, Math.PI * 1), new THREE.MeshStandardMaterial({ color: 0x666666 }));
                arcade.translateX(plane.plane.position.x);
                arcade.translateZ(plane.plane.position.z);
                arcade.translateY(0.02);
                arcade.rotateX(Math.PI * 0.5);
                scene.add(arcade);
            }
            // オブジェクト：低い建物を作成する
            if (data.type == 'place' || data.type == 'y-place') {
                result = new FieldPlace(scene, data, dioData.polygon);
            }
            // オブジェクト：高い建物を作成する
            if (data.type == 'x-building' || data.type == 'y-building') {
                result = new Building(scene, data);
            }
            // 共通情報を設定する
            result.setLabel(data.label);
            if (data.index) {
                result.setIndex(data.index);
            }
            if (data.iterator) {
                result.setIterator(data.iterator);
            }
            // ユーザーデータを設定する
            result.setUserData({
                clickable: true,
                type: data.type,
                label: data.label,
            });
            return result;
        });
    }
}
