import { EventDispatcher } from 'three';
import * as THREE from 'three';
// import { DebugHelper } from "./debug-helper";
import { Camera } from './camera';
/** three.jsの中心処理 */
export class Core {
    /** マーカー注視点を初期化する */
    initLookAtMarker(scene, point) {
        const sphere = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        });
        const mesh = new THREE.Mesh(sphere, material);
        mesh.position.set(point.x, point.y, point.z);
        mesh.visible = false;
        scene.add(mesh);
        return mesh;
    }
    /** クリック情報から、操作対象のオブジェクトを取得する */
    getControlledObject(x, y) {
        try {
            // タップ位置にある3D上のオブジェクトを取得する
            this._laycast.setFromCamera({
                x: x,
                y: y,
            }, this.camera.camera);
            const res = this._laycast
                .intersectObjects(this.scene.children)
                .map(r => r.object.userData)
                .filter(r => (r.clickable ? true : false));
            if (res.length >= 1) {
                // オブジェクトを返す
                return res[0];
            }
        }
        catch (err) {
            console.error(err);
        }
        return undefined;
    }
    /** パニングのモードを設定する */
    setPanningMode(value) {
        if (value) {
            this.startPanningMode();
        }
        else {
            this.endPanningMode();
        }
    }
    /** 注視点を更新する */
    updateLookAtPoint(position) {
        this._lookAtMarker.position.setY(position.y);
        this._camera.controls.target.set(position.x, position.y, position.z);
        this._camera.camera.lookAt(position);
    }
    /** 画面のモードをパニングに変更する */
    startPanningMode() {
        const control = this._camera.controls;
        this._camera.setPanningMode(true);
        control.touches = {
            ONE: THREE.TOUCH.PAN,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
        };
        control.mouseButtons = {
            LEFT: THREE.MOUSE.PAN,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.PAN,
        };
    }
    /** 画面のパニングモードを終了する */
    endPanningMode() {
        const control = this._camera.controls;
        this._camera.setPanningMode(false);
        control.touches = {
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_ROTATE,
        };
        control.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: THREE.MOUSE.ROTATE,
        };
    }
    /** コンストラクタ */
    constructor(appElement) {
        // シーンを初期化
        const scene = new THREE.Scene();
        this._scene = scene;
        // タッチコントローラを定義
        this._laycast = new THREE.Raycaster();
        // アニメーションミキサーを定義
        this._cameraMixer = null;
        this._lookAtMixier = null;
        // 注視点を作成
        this._lookAtMarker = this.initLookAtMarker(scene, scene.position);
        // イベント通知者を作成
        this._eventDispatcher = new EventDispatcher();
        // デバッグを有効化
        // new DebugHelper().enableGuide(scene);
        // レンダラーの初期化
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0xffffff, 1.0); // 背景色
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(appElement.offsetWidth, appElement.offsetHeight);
        // レンダラーをDOMに追加
        appElement.appendChild(renderer.domElement);
        const cameraDelegate = new Camera(scene, appElement.offsetWidth / appElement.offsetHeight, renderer.domElement);
        this._camera = cameraDelegate;
        this.setPanningMode(true);
        // 描画ループを開始
        let latest = 0;
        renderer.setAnimationLoop(t => {
            const deltaMilliseconds = t - latest;
            latest = t;
            // カメラコントローラーを更新
            cameraDelegate.controls.update();
            // アニメーションを更新
            if (this._cameraMixer) {
                this._cameraMixer.update(deltaMilliseconds / 1000);
                const mixier = this._cameraMixer;
                if (mixier._actions[0].paused) {
                    this._cameraMixer = null;
                    // アニメーションの終了でコントローラを開放する
                    this._camera.controls.enabled = true;
                }
            }
            // アニメーションを更新
            if (this._lookAtMixier) {
                this._lookAtMixier.update(deltaMilliseconds / 1000);
                const mixier = this._lookAtMixier;
                if (mixier._actions[0].paused) {
                    this._lookAtMixier = null;
                }
            }
            this._eventDispatcher.dispatchEvent({
                polarAngle: cameraDelegate.polarAngleDegrees,
                azimuthalAngle: cameraDelegate.azimuthalAngleDegrees,
                distance: cameraDelegate.distance,
                type: 'render',
            });
            // 描画する
            renderer.render(scene, cameraDelegate.camera);
        });
    }
    /** シーンを返却する */
    get scene() {
        return this._scene;
    }
    /** カメラオブジェクトを返却する */
    get camera() {
        return this._camera;
    }
    /** イベントの配信インスタンスを作成する */
    get eventDispatcher() {
        return this._eventDispatcher;
    }
    /** 移動アニメーションを適用する */
    applyMoveAnimation(mixier, fromPoint, toPoint, duration) {
        const action = mixier.clipAction(new THREE.AnimationClip('Action', duration, [
            new THREE.VectorKeyframeTrack('.position', [0, duration], [
                fromPoint.x,
                fromPoint.y,
                fromPoint.z,
                toPoint.x,
                toPoint.y,
                toPoint.z,
            ], THREE.InterpolateSmooth),
        ]));
        action.setLoop(THREE.LoopOnce, 1);
        action.startAt(0);
        action.clampWhenFinished = true;
        action.play();
    }
    /** 移動する */
    move(stands, lookAt, duration) {
        // カメラの移動をアニメーションする
        this._cameraMixer = new THREE.AnimationMixer(this.camera.camera);
        // 現在の注視点の位置をカメラに合わせる
        const cameraDelegate = this._camera;
        const currentLookAt = cameraDelegate.controls.target;
        this._lookAtMarker.position.set(currentLookAt.x, currentLookAt.y, currentLookAt.z);
        // 注視点をアニメーション、プロキシを使って関連するオブジェクトに展開する
        const marker = this._lookAtMarker;
        this._lookAtMixier = new THREE.AnimationMixer(new Proxy(this._lookAtMarker, {
            set(obj, property, value, receiver) {
                if (property == 'matrixWorldNeedsUpdate') {
                    cameraDelegate.camera.lookAt(marker.position);
                    cameraDelegate.controls.target.set(marker.position.x, marker.position.y, marker.position.z);
                }
                return Reflect.set(obj, property, value, receiver);
            },
        }));
        // アニメーション中の操作を禁止する
        this._camera.controls.enabled = false;
        // アニメーションを開始する
        this.applyMoveAnimation(this._cameraMixer, this.camera.camera.position, stands, duration);
        // アニメーションを開始する
        this.applyMoveAnimation(this._lookAtMixier, this._lookAtMarker.position, lookAt, duration);
    }
}
