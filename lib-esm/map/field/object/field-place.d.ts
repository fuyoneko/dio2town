import * as THREE from 'three';
import { FieldObjectBase } from './field-object-base';
import { SpritePanel } from './sprite-panel';
import type { DioData } from '../../../map/parser/dio-data';
import { FieldPlaceBuildingObject } from './field-place-build-object';
import { GeoRectangle } from './geo-rectangle';
/** 平面のマップ部品を描画する */
export declare class FieldPlace extends FieldObjectBase {
    _spritePanel: SpritePanel | null;
    _buildingObject: FieldPlaceBuildingObject;
    _objectSpace: GeoRectangle;
    /** コンストラクタ */
    constructor(scene: THREE.Scene, data: DioData);
    /** スプライトオブジェクトとしてテキストラベルを作成する */
    createSpliteLabel(data: DioData): any;
    /** ピッチが下がった時に表示する詳細ビュー（オブジェクト）を設定する */
    createBuildingObject(scene: THREE.Scene, data: DioData): FieldPlaceBuildingObject;
    /** ピッチの状態に応じて、詳細ビューの表示状態を更新する */
    didUpdateCameraStatus(polarAngle: number, azimuthalAngle: number, distance: number, cameraPosition: THREE.Vector3): void;
    /** 選択状態を更新、オーバレイ表示する */
    showOverlay(): void;
    /** オーバレイ表示を終了する */
    hideOverlay(): void;
}
