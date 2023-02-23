/** 平面上の座標の構造体を設定する */
export declare class GeoPoint {
    private _x;
    private _z;
    /** コンストラクタ */
    constructor(x: number, z: number);
    /** X座標を取得する */
    get x(): number;
    /** Z座標を取得する */
    get z(): number;
}
