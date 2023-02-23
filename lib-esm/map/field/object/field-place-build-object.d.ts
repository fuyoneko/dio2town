import type * as THREE from 'three';
/** 詳細表示用のオブジェクト */
export declare class FieldPlaceBuildingObject {
    private _lazyLoadBuilding?;
    private _labelSprite?;
    private _lazyLoadBuildingScale;
    /** コンストラクタ */
    constructor();
    /** 表示サイズを返却する */
    get lazyLoadBuildingScale(): number;
    /** 詳細表示用のオブジェクトをコンテンツとして設定する */
    withContents(lazyLoadBuilding: THREE.Object3D, labelSprite: THREE.Sprite): this;
    /** 早期読み込み用の立方体を、実際に読み込んだLOD2のオブジェクトに置き換える */
    replaceLazyLoadBuilding(scene: THREE.Scene, lazyLoadBuilding: THREE.Object3D, scale: number, rotate: number, yPosition?: number): void;
    /** base64のデータをバイナリ形式で読み込む */
    base64ToArrayBuffer(base64: any): ArrayBufferLike;
    /** オブジェクトが存在すればアクセスする */
    accessToLazyLoadBuilding(accessor: (lazyLoadBuilding: THREE.Object3D, labelSprite: THREE.Sprite) => void): void;
}
