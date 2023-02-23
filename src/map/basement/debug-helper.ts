import * as THREE from 'three';

/** デバッグ情報の管理クラス */
export class DebugHelper {
  /** コンストラクタ */
  constructor() {}

  /** ガイド線を表示する */
  enableGuide(scene: THREE.Scene) {
    // 座表軸
    const axes = new THREE.AxesHelper();
    scene.add(axes);
    return this;
  }
}
