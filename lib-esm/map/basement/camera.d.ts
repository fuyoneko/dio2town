import * as THREE from 'three';
/** カメラの操作情報を管理するクラス */
export declare class Camera {
    private _camera;
    private _controls;
    private _panningMode;
    private _clickStatus;
    private _latestPointerDown;
    private _eventDispatcher;
    /**
     * コンストラクタ
     *
     * @param scene - シーンオブジェクト
     * @param aspect - 画面のアスペクト比
     * @param target - 描画対象のHTMLオブジェクト
     */
    constructor(scene: THREE.Scene, aspect: number, target: HTMLCanvasElement);
    /** 自動回転を有効にする */
    enableAutoRotate(): void;
    /** カメラから中心点方向への角度（縦方向の角度）をdegreeで取得する */
    get polarAngleDegrees(): number;
    /** カメラから中心点への水平方向の角度をdegreeで取得する */
    get azimuthalAngleDegrees(): number;
    /** カメラと中心点までの距離を取得する */
    get distance(): any;
    /** カメラの管理インスタンスを取得する */
    get camera(): THREE.PerspectiveCamera;
    /** 画面操作の管理インスタンスを取得する */
    get controls(): MapOrbitControls;
    /** イベント配信オブジェクトの管理インスタンスを取得する */
    get eventDispatcher(): EventDispatcher;
    /** パンモードを更新する */
    setPanningMode(value: boolean): void;
}
