import * as THREE from 'three';
import { FieldObjectBase } from './object/field-object-base';
import { Vector3 } from 'three';
import type { DioParseResult } from '../parser/dio-parser';
/**
 * Comment
 */
export declare class MainField {
    _fieldObjectList: FieldObjectBase[];
    /** */
    constructor();
    /** 壁を追加する */
    addWall(scene: THREE.Scene, minX: any, minY: any, maxX: any, maxY: any): void;
    /**
     * ラベルにハイライトを設定する
     *
     * @param label - 選択されたラベルのテキスト
     */
    highlightWithLabel(label: string): void;
    /**
     * ラベルにホバーを設定する
     *
     * @param label - ホバーされたラベルのテキスト
     */
    hoverWithLabel(label: string): void;
    /**
     * ラベルにハイライトを設定する
     *
     * @param index - 選択されたインデックス
     */
    highlightWithIndex(index: Array<string>): void;
    /** イテレータを元に、対象のラベルを返却する */
    labelFromIterator(iterator: string): string;
    /** ハイライトの状態を初期化する */
    clearHighlight(): void;
    /** ホバー状態を初期化する */
    clearHover(): void;
    /** カメラの状態が更新された */
    didUpdateCameraStatus(polarAngle: number, azimuthalAngle: number, distance: number, cameraPosition: Vector3): void;
    /** Dioをもとに、データを初期化する */
    basement(scene: THREE.Scene, dioData: DioParseResult, progress: (started: number, count: number) => void): void;
}
