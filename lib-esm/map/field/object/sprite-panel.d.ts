import * as THREE from 'three';
/** スプライト（回転してもユーザーの方向を向くプレート）を描画する */
export declare class SpritePanel {
    _sprite: THREE.Sprite;
    _image: THREE.Sprite;
    _imageSrcFile: string;
    _loaded: boolean;
    /** 角丸図形を描画する */
    roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number): void;
    /** コンストラクタ */
    constructor(scene: THREE.Scene, imageSrc: string);
    /** 画像の描画エリアを作成する */
    imageArea(scene: THREE.Scene, base64Texture: string): any;
    /** 角丸の下の、ピンの矢印を描画する */
    pinBasement(scene: THREE.Scene, googleAnotation?: boolean): any;
    /** スプライトを返却する */
    get sprite(): THREE.Sprite;
    /** スプライト上に表示している画像を返却する */
    get image(): THREE.Sprite;
    /** 位置座標を設定する */
    setPosition(x: number, z: number): void;
    /** 表示する */
    show(): void;
    /** 隠す */
    hide(): void;
}
