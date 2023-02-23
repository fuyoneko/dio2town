import { Color } from '../../util/color';
import * as THREE from 'three';
/**
 * フィールド上に表示するオブジェクトの共通クラス
 */
export class FieldObjectBase {
    /**
     * コンストラクタ
     */
    constructor() {
        this._overlay = null;
        this._hover = null;
        this._label = '';
        this._index = '';
        this._iterator = '';
        this._boundingBox = [];
    }
    /** */
    rectangleToVertex(x1, x2, z1, z2, y) {
        return [
            //
            ...[x1, y, z1],
            ...[x1, y, z2],
            ...[x2, y, z1],
            //
            ...[x2, y, z2],
            ...[x2, y, z1],
            ...[x1, y, z2],
        ];
    }
    /**
     * オーバーレイを初期化する
     */
    initOverlay(scene, p1, p2, height) {
        // 四角形の板を作成する
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.rectangleToVertex(p1.x, p2.x, p1.z, p2.z, height + 0.0001)), 3));
        geo.computeVertexNormals();
        // 半透明の黄色を設定する
        const material = new THREE.MeshStandardMaterial({
            color: Color.yellow.asInteger,
            opacity: 0.2,
            transparent: true,
            depthTest: true,
        });
        // オブジェクトを描画する
        const plane = new THREE.Mesh(geo, material);
        this._overlay = plane;
        plane.visible = false;
        scene.add(plane);
    }
    /**
     * ホバー押下表示を初期化する
     */
    initHover(scene, p1, p2, height) {
        // 四角形の板を作成する
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.rectangleToVertex(p1.x, p2.x, p1.z, p2.z, height + 0.0002)), 3));
        geo.computeVertexNormals();
        // 半透明の黒色を設定する
        const material = new THREE.MeshStandardMaterial({
            color: Color.black.asInteger,
            opacity: 0.4,
            transparent: true,
            depthTest: true,
        });
        // オブジェクトを描画する
        const plane = new THREE.Mesh(geo, material);
        this._hover = plane;
        plane.visible = false;
        scene.add(plane);
    }
    /** オーバーレイを表示する */
    showOverlay() {
        if (this._overlay) {
            this._overlay.visible = true;
        }
    }
    /** ホバーを表示する */
    showHover() {
        if (this._hover) {
            this._hover.visible = true;
        }
    }
    /** オーバーレイを隠す */
    hideOverlay() {
        if (this._overlay) {
            this._overlay.visible = false;
        }
    }
    /** ホバーを隠す */
    hideHover() {
        if (this._hover) {
            this._hover.visible = false;
        }
    }
    /** ラベルテキストを設定する */
    setLabel(label) {
        this._label = label;
    }
    /** インデックスを設定する */
    setIndex(index) {
        this._index = index;
    }
    /** アクセス用のイテレータを設定する */
    setIterator(iterator) {
        this._iterator = iterator;
    }
    /**
     * 選択用のバウンディングボックスを追加、
     * 追加したオブジェクトがタップされたときにこのオブジェクトが選択されたと判断する
     */
    addBoundingBox(boundingObject) {
        this._boundingBox.push(boundingObject);
    }
    /** 選択時に自身を識別するためのユーザーデータを設定する */
    setUserData(userData) {
        if (this._boundingBox.length >= 1) {
            this._boundingBox.forEach(item => {
                item.userData = userData;
            });
        }
    }
    /**
     * カメラの状態が更新されたことを通知する
     *
     * @param polarAngle - カメラから視点に対する角度（縦方向の角度）
     * @param azimuthalAngle - カメラの横方向の角度
     * @param distance - カメラとオブジェクトとの距離
     * @param cameraPosition - カメラの位置
     */
    didUpdateCameraStatus(polarAngle, azimuthalAngle, distance, cameraPosition) { }
    /** 検索用のラベル文字列を返却する */
    get label() {
        return this._label;
    }
    /** インデックスを返却する */
    get index() {
        return this._index;
    }
    /** アクセス用のイテレータを返却する */
    get iterator() {
        return this._iterator;
    }
}
