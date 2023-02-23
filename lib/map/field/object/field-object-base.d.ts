import type { Mesh, Object3D, Vector3 } from 'three';
import type { GeoPoint } from './geo-point';
import * as THREE from 'three';
/**
 * フィールド上に表示するオブジェクトの共通クラス
 */
export declare class FieldObjectBase {
    _overlay: Mesh | null;
    _hover: Mesh | null;
    _label: string;
    _index: string;
    _iterator: string;
    _boundingBox: Object3D[];
    /**
     * コンストラクタ
     */
    constructor();
    /** */
    rectangleToVertex(x1: number, x2: number, z1: number, z2: number, y: number): number[];
    /**
     * オーバーレイを初期化する
     */
    initOverlay(scene: THREE.Scene, p1: GeoPoint, p2: GeoPoint, height: number): void;
    /**
     * ホバー押下表示を初期化する
     */
    initHover(scene: THREE.Scene, p1: GeoPoint, p2: GeoPoint, height: number): void;
    /** オーバーレイを表示する */
    showOverlay(): void;
    /** ホバーを表示する */
    showHover(): void;
    /** オーバーレイを隠す */
    hideOverlay(): void;
    /** ホバーを隠す */
    hideHover(): void;
    /** ラベルテキストを設定する */
    setLabel(label: string): void;
    /** インデックスを設定する */
    setIndex(index: string): void;
    /** アクセス用のイテレータを設定する */
    setIterator(iterator: string): void;
    /**
     * 選択用のバウンディングボックスを追加、
     * 追加したオブジェクトがタップされたときにこのオブジェクトが選択されたと判断する
     */
    addBoundingBox(boundingObject: Object3D): void;
    /** 選択時に自身を識別するためのユーザーデータを設定する */
    setUserData(userData: {
        [key: string]: any;
    }): void;
    /**
     * カメラの状態が更新されたことを通知する
     *
     * @param polarAngle - カメラから視点に対する角度（縦方向の角度）
     * @param azimuthalAngle - カメラの横方向の角度
     * @param distance - カメラとオブジェクトとの距離
     * @param cameraPosition - カメラの位置
     */
    didUpdateCameraStatus(polarAngle: number, azimuthalAngle: number, distance: number, cameraPosition: Vector3): void;
    /** 検索用のラベル文字列を返却する */
    get label(): string;
    /** インデックスを返却する */
    get index(): string;
    /** アクセス用のイテレータを返却する */
    get iterator(): string;
}
