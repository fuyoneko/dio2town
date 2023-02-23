import type { DioData } from '../../../map/parser/dio-data';
import * as THREE from 'three';
import { FieldObjectBase } from './field-object-base';
/** 高速道路を管理するオブジェクト */
export declare class Highway extends FieldObjectBase {
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
    constructor(scene: THREE.Scene, data: DioData, minX: any, minY: any, maxX: any, maxY: any);
}
export default Highway;
