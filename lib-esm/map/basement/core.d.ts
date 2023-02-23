import type { Vector3 } from 'three';
import { EventDispatcher } from 'three';
import * as THREE from 'three';
import { Camera } from './camera';
interface RenderEvent extends THREE.Event {
    polarAngle: number;
    azimuthalAngle: number;
    distance: number;
}
/** three.jsの中心処理 */
export declare class Core {
    _scene: THREE.Scene;
    _camera: Camera;
    _cameraMixer: THREE.AnimationMixer | null;
    _lookAtMixier: THREE.AnimationMixer | null;
    _lookAtMarker: THREE.Mesh;
    _laycast: THREE.Raycaster;
    _eventDispatcher: EventDispatcher<RenderEvent>;
    /** マーカー注視点を初期化する */
    initLookAtMarker(scene: THREE.Scene, point: THREE.Vector3): any;
    /** クリック情報から、操作対象のオブジェクトを取得する */
    getControlledObject(x: number, y: number): any;
    /** パニングのモードを設定する */
    setPanningMode(value: boolean): void;
    /** 注視点を更新する */
    updateLookAtPoint(position: Vector3): void;
    /** 画面のモードをパニングに変更する */
    startPanningMode(): void;
    /** 画面のパニングモードを終了する */
    endPanningMode(): void;
    /** コンストラクタ */
    constructor(appElement: HTMLDivElement);
    /** シーンを返却する */
    get scene(): THREE.Scene;
    /** カメラオブジェクトを返却する */
    get camera(): Camera;
    /** イベントの配信インスタンスを作成する */
    get eventDispatcher(): EventDispatcher<RenderEvent>;
    /** 移動アニメーションを適用する */
    applyMoveAnimation(mixier: THREE.AnimationMixer, fromPoint: THREE.Vector3, toPoint: THREE.Vector3, duration: number): void;
    /** 移動する */
    move(stands: THREE.Vector3, lookAt: THREE.Vector3, duration: number): void;
}
export {};
