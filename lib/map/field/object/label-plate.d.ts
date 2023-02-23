import type { ColorWrapper } from '../../../map/util/color';
/** ラベルプレートの書記か情報を定義する */
interface LabelPlateInterface {
    x1: number;
    z1: number;
    x2: number;
    z2: number;
    y: number;
    label: string;
    fontSize: number;
    backgroundColor: ColorWrapper;
}
/** テキストラベルを管理するクラス */
export declare class LabelPlate {
    private _plane;
    private _basement;
    /** テクスチャの向きに合わせて法線を設定する */
    convertToUV(): number[];
    /** 四角形を頂点情報に変換する */
    rectangleToVertex(x1: number, x2: number, z1: number, z2: number, y: number): number[];
    /** フォントサイズをGL空間上の大きさに変換する */
    convertFontSizeToGlSize(fontSize: number): number;
    /** テキストラベルを作成する */
    createLabel(property: LabelPlateInterface): any;
    /** テキストラベルの背景パネルを作成する */
    createBasement(property: LabelPlateInterface): any;
    /** コンストラクタ */
    constructor(property: LabelPlateInterface);
    /** テキストラベルを返却する */
    get plane(): THREE.Mesh;
    /** テキストラベルの背景パネルを返却する */
    get basement(): THREE.Mesh;
}
export {};
