import type { GeoPoint } from './geo-point';
import { ColorWrapper } from '../../util/color';
import * as THREE from 'three';
/** 基本図形を描画する */
export declare class Plane {
    /** 板を描画する */
    static drawPlane(scene: THREE.Scene, p1: GeoPoint, p2: GeoPoint, height?: number, color?: ColorWrapper): {
        geo: any;
        material: any;
        plane: any;
    };
    /** テクスチャのある板を作成する */
    static drawTexturePlane(scene: THREE.Scene, text: string, p1: GeoPoint, p2: GeoPoint, yPosition?: number, fontSize?: number): any;
}
