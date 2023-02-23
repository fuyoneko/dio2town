import type { GeoPoint } from './geo-point';
/** 四角形の構造体を定義する */
export declare class GeoRectangle {
    private _p1;
    private _p2;
    /** 始点、終点から四角形を作成する */
    constructor(p1: GeoPoint, p2: GeoPoint);
    /** 始点を取得する */
    get p1(): GeoPoint;
    /** 終点を取得する */
    get p2(): GeoPoint;
    /** 点が矩形内にあればtrueを返す */
    isIntersect(x: number, z: number): boolean;
}
