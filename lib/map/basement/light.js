"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Light = void 0;
const THREE = require("three");
const color_1 = require("../util/color");
/** 光源の管理オブジェクト */
class Light {
    /** コンストラクタ */
    constructor(scene) {
        const light = new THREE.DirectionalLight(color_1.Color.white.asInteger);
        light.intensity = 1.98; // 光の強さを倍に
        light.position.set(0, 3, 3);
        // シーンに追加
        scene.add(light);
        const secondary = new THREE.DirectionalLight(color_1.Color.white.asInteger);
        secondary.intensity = 0.45; // 光の強さを倍に
        secondary.position.set(-3, -3, -1);
        // シーンに追加
        scene.add(secondary);
        // 環境光
        const ambient = new THREE.AmbientLight(color_1.Color.white.asInteger, 0.6);
        scene.add(ambient);
    }
}
exports.Light = Light;
