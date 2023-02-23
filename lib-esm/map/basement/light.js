import * as THREE from 'three';
import { Color } from '../util/color';
/** 光源の管理オブジェクト */
export class Light {
    /** コンストラクタ */
    constructor(scene) {
        const light = new THREE.DirectionalLight(Color.white.asInteger);
        light.intensity = 1.98; // 光の強さを倍に
        light.position.set(0, 3, 3);
        // シーンに追加
        scene.add(light);
        const secondary = new THREE.DirectionalLight(Color.white.asInteger);
        secondary.intensity = 0.45; // 光の強さを倍に
        secondary.position.set(-3, -3, -1);
        // シーンに追加
        scene.add(secondary);
        // 環境光
        const ambient = new THREE.AmbientLight(Color.white.asInteger, 0.6);
        scene.add(ambient);
    }
}
