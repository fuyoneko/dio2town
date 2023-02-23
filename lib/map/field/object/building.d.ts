import { FieldObjectBase } from './field-object-base';
import type { DioData } from '../../../map/parser/dio-data';
import type * as THREE from 'three';
/**
 * 立体の建物を作成する
 * type : building
 */
export declare class Building extends FieldObjectBase {
    /**
     * コンストラクタ
     *
     * @param scene - シーンオブジェクト
     * @param data - Draw.ioのデータオブジェクト
     */
    constructor(scene: THREE.Scene, data: DioData);
}
