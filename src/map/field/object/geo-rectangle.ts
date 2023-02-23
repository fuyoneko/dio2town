import type { GeoPoint } from './geo-point';

/** 四角形の構造体を定義する */
export class GeoRectangle {
  // 始点
  private _p1: GeoPoint;
  // 終点
  private _p2: GeoPoint;

  /** 始点、終点から四角形を作成する */
  constructor(p1: GeoPoint, p2: GeoPoint) {
    this._p1 = p1;
    this._p2 = p2;
  }

  /** 始点を取得する */
  get p1() {
    return this._p1;
  }

  /** 終点を取得する */
  get p2() {
    return this._p2;
  }

  /** 点が矩形内にあればtrueを返す */
  isIntersect(x: number, z: number) {
    if (
      this._p1.x <= x &&
      x <= this._p2.x &&
      this._p1.z <= z &&
      z <= this._p2.z
    ) {
      return true;
    }
    return false;
  }
}
