/** 平面上の座標の構造体を設定する */
export class GeoPoint {
    /** コンストラクタ */
    constructor(x, z) {
        this._x = x;
        this._z = z;
    }
    /** X座標を取得する */
    get x() {
        return this._x;
    }
    /** Z座標を取得する */
    get z() {
        return this._z;
    }
}
