import { EventDispatcher, Vector2 } from 'three';
import * as THREE from 'three';
import { MapOrbitControls } from './threejs-custom/MapOrbitControls';

/** カメラの操作イベントのパラメータ */
interface CameraEvent extends THREE.Event {
  // 操作を受けた座標
  mousePoint: Vector2;
}

/** カメラの操作情報を管理するクラス */
export class Camera {
  // カメラの管理インスタンス
  private _camera: THREE.PerspectiveCamera;
  // 画面操作（オービット）の管理インスタンス
  private _controls: MapOrbitControls;
  // パン（平行移動）モード、ローテート（回転）モードの状態フラグ
  private _panningMode: boolean;
  // クリック状態の管理フラグ
  private _clickStatus: boolean;
  // 最後にクリックされた座標情報
  private _latestPointerDown: Vector2;
  // イベントの配信オブジェクト
  private _eventDispatcher: EventDispatcher;

  /**
   * コンストラクタ
   *
   * @param scene - シーンオブジェクト
   * @param aspect - 画面のアスペクト比
   * @param target - 描画対象のHTMLオブジェクト
   */
  constructor(scene: THREE.Scene, aspect: number, target: HTMLCanvasElement) {
    // カメラを初期化
    const camera = new THREE.PerspectiveCamera(50, aspect);
    camera.position.set(-0.6, 0.6, 0.6);
    camera.lookAt(scene.position);
    this._camera = camera;
    this._clickStatus = false;
    this._latestPointerDown = new Vector2();

    // カメラコントローラー設定
    const orbitControls = new MapOrbitControls(camera, target);
    const maxPolarAngleDigree = 90.0;
    orbitControls.screenSpacePanning = false;
    orbitControls.maxPolarAngle = (maxPolarAngleDigree / 180.0) * Math.PI;
    orbitControls.minDistance = 0.1;
    orbitControls.maxDistance = 100;

    this._panningMode = false;
    this._controls = orbitControls;
    this._eventDispatcher = new EventDispatcher<CameraEvent>();

    orbitControls.domElement.addEventListener(
      'pointerdown',
      e => {
        const event: any = e;
        const element = event.currentTarget;
        // 値を初期化する
        this._latestPointerDown.set(0, 0);
        // HTMLの幅・高さ
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        // HTMLの高さが正常であれば処理をする
        if (width >= 1.0 && height >= 1.0) {
          // HTML上のXY座標
          const x = event.clientX - element.offsetLeft;
          const y = event.clientY - element.offsetTop;
          // -1.0 ~ 1.0の大きさに正規化する
          this._latestPointerDown.set(
            (x / width) * 2 - 1.0,
            -(y / height) * 2 + 1.0
          );
        }
      },
      true // UseCaptureフラグを立てることで、他のイベントよりも実行を早くする
    );
    orbitControls.addEventListener('start', e => {
      // 画面に対して何かの操作をしたのであればフラグを立てる
      this._clickStatus = true;
      // ホバーを開始する
      this._eventDispatcher.dispatchEvent({
        mousePoint: this._latestPointerDown,
        type: 'hover-start-orbit',
      });
    });
    orbitControls.addEventListener('change', e => {
      // フラグが下がっていないのなら、ホバーを終了する
      if (this._clickStatus) {
        this._eventDispatcher.dispatchEvent({
          mousePoint: this._latestPointerDown,
          type: 'hover-cancel-orbit',
        });
      }
      // 画面をオービットで動かしたのならフラグを下げる
      this._clickStatus = false;
    });
    orbitControls.addEventListener('end', e => {
      // オービットを動かさず、タップを終了したのならイベントを実行する
      if (this._clickStatus) {
        // ホバーを終了する
        this._eventDispatcher.dispatchEvent({
          mousePoint: this._latestPointerDown,
          type: 'hover-cancel-orbit',
        });
        // クリックを通知する
        this._eventDispatcher.dispatchEvent({
          mousePoint: this._latestPointerDown,
          type: 'click-orbit',
        });
      }
    });
  }

  /** 自動回転を有効にする */
  enableAutoRotate() {
    this._controls.autoRotate = true; // カメラの自動回転設定
    this._controls.autoRotateSpeed = 1.0; // カメラの自動回転速度
  }

  /** カメラから中心点方向への角度（縦方向の角度）をdegreeで取得する */
  get polarAngleDegrees() {
    const angle = this._controls.getPolarAngle();
    return Math.floor((angle / Math.PI) * 180.0);
  }

  /** カメラから中心点への水平方向の角度をdegreeで取得する */
  get azimuthalAngleDegrees() {
    const angle = this._controls.getAzimuthalAngle();
    return Math.floor((angle / Math.PI) * 180.0);
  }

  /** カメラと中心点までの距離を取得する */
  get distance() {
    return this._controls.getDistance();
  }

  /** カメラの管理インスタンスを取得する */
  get camera() {
    return this._camera;
  }

  /** 画面操作の管理インスタンスを取得する */
  get controls() {
    return this._controls;
  }

  /** イベント配信オブジェクトの管理インスタンスを取得する */
  get eventDispatcher() {
    return this._eventDispatcher;
  }

  /** パンモードを更新する */
  setPanningMode(value: boolean) {
    this._panningMode = value;
  }
}
