import * as THREE from 'three';
/** スプライト（回転してもユーザーの方向を向くプレート）を描画する */
export class SpritePanel {
    /** 角丸図形を描画する */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    /** コンストラクタ */
    constructor(scene, imageSrc) {
        // 背景画像を作成する
        this._sprite = this.pinBasement(scene);
        this._sprite.visible = true;
        // 遅延読み込みの完了フラグを下ろす
        this._loaded = false;
        // 読み込み中の代替画像（カメラマーク）を指定する
        const lazyLoadTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAB+0lEQVR4XmNkYGD4zjCIABPDIAOjDiIUISy4FHh4eDDp6ekxMTMzUzVS//79y3Dp0qV/O3bs+IfL4O/QhA2nly1b9uc/jQHIDnR7YRkMxUHAkPn5n07Azc3tJ7qjMBK1sbEx3RK6qakphl0YAuzs7HQrCLDZNZrtCQX/aAiNhhClWXQ0DY2mIVAI5Obm/r5+/fp/ctIT1dPQ9OnT/06ZMuVvWFjYr69fv5LsJpIdtGTJkr+vX7/G6vuTJ0/+Kygo+A1yxZUrV/7n5eX9JtVFJDnoxIkT/5KTk38HBgb+/vnzJ4pdIEeGhob+/vXrF1x83rx5fxctWvSXFEcR7aBXr179DwkJAVt49OjRfxkZGXDf//v3jyEuLu7348ePMUIuKyuLpPRElIP+/PnDEB4e/vvp06dwCxcsWPC3t7f3D8j3NTU1f3A1SUHpiNT0hNJibGpq+o3eYCwuLgaFBkZTl4mJ6XtRUdFvRkZGDDkGSH8PLp6UlPQL3VyQXejqCIbQpk2b/vb19f3Blg5AUQWSA1pEMJkQm57wOujWrVv/Y2NjfxNjITEJl5j0xILPIDU1NcaPHz9yMNARYIQQenampVuw2YXhoDNnzvyjV4DgsmtQdRRxDse4u7szWVhYMHFzc1M1wEDlEqjE37lzJ9aYGB0fIhTco01YQiEEAOsBUvPHH1TRAAAAAElFTkSuQmCC';
        // 読み込み対象画像のURLをメンバ変数に保持する
        this._imageSrcFile = imageSrc;
        // 遅延読み込み用の画像をセットして、スプライトイメージを配置する
        this._image = this.imageArea(scene, lazyLoadTexture);
        // 表示状態を非表示にする
        this.hide();
    }
    /** 画像の描画エリアを作成する */
    imageArea(scene, base64Texture) {
        // 空の画像データを作成する
        const material = new THREE.SpriteMaterial();
        material.depthTest = false;
        // スプライト画像を作成する
        const imageSprite = new THREE.Sprite(material);
        scene.add(imageSprite);
        imageSprite.scale.set(0.05, 0.05, 0.32);
        // 36ピクセルの遅延読み込み中表示を設定する
        const image = new Image();
        image.src = base64Texture;
        image.width = 36;
        image.height = 36;
        image.onload = () => {
            // Base64から画像の読み込みが完了したら、設定を反映する
            // ただし、本番データの読み込みが始まっている、または読み込み済みなら反映しない
            if (material.map) {
                // 本番データ読み込み済み
                return;
            }
            if (!this._loaded) {
                material.map = new THREE.Texture(image);
                material.map.needsUpdate = true;
            }
        };
        return imageSprite;
    }
    /** 角丸の下の、ピンの矢印を描画する */
    pinBasement(scene, googleAnotation = true) {
        var _a;
        const canvasForText = document.createElement('canvas');
        const ctx = (_a = canvasForText.getContext('2d')) !== null && _a !== void 0 ? _a : new CanvasRenderingContext2D();
        ctx.canvas.width = 300.0;
        ctx.canvas.height = 200.0;
        // 透過する黒色の背景を描く
        ctx.fillStyle = 'rgba(40, 40, 40, 0.85)';
        // 角丸四角形を描画する
        this.roundRect(ctx, 0, 0, ctx.canvas.width, ctx.canvas.height - 40.0, 8.0);
        ctx.fill();
        // 矢印を描画する
        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width / 2 - 30.0, ctx.canvas.height - 40.0);
        ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
        ctx.lineTo(ctx.canvas.width / 2 + 30.0, ctx.canvas.height - 40.0);
        ctx.closePath();
        ctx.fill();
        // GoogleMapからの出典であることを明記する
        if (googleAnotation) {
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillText('Map data ©2019 Google', 10, ctx.canvas.height - 40.0 - 2.0);
        }
        // 背景データを表示する
        const material = new THREE.SpriteMaterial({
            map: new THREE.CanvasTexture(canvasForText),
        });
        material.opacity = 1.0;
        material.depthTest = false;
        const sprite = new THREE.Sprite(material);
        scene.add(sprite);
        sprite.scale.set(0.35, 0.35 / 1.5, 0.35);
        return sprite;
    }
    /** スプライトを返却する */
    get sprite() {
        return this._sprite;
    }
    /** スプライト上に表示している画像を返却する */
    get image() {
        return this._image;
    }
    /** 位置座標を設定する */
    setPosition(x, z) {
        this.sprite.position.set(x, 0.05 + this.sprite.scale.y * 0.5, z);
        this.image.position.set(x, 0.05 + this.sprite.scale.y * 0.5 + 0.03, z);
    }
    /** 表示する */
    show() {
        // 画像パネルを表示状態にする
        this.sprite.visible = true;
        this.image.visible = true;
        // 遅延読み込みが未実施なら、読み込みを開始する
        if (!this._loaded) {
            this._loaded = true;
            new THREE.TextureLoader().loadAsync(this._imageSrcFile).then(image => {
                var _a;
                // レイジーロード用の画像を破棄する
                if (this._image.material.map) {
                    (_a = this._image.material.map) === null || _a === void 0 ? void 0 : _a.dispose();
                    this._image.material.map = null;
                }
                // 画像を読み込む
                this._image.scale.set(0.32, 0.32 * (210 / 400), 0.32);
                this._image.material.map = image;
                this._image.material.map.needsUpdate = true;
            });
        }
    }
    /** 隠す */
    hide() {
        // 画像パネルを非表示状態にする
        this.sprite.visible = false;
        this.image.visible = false;
        // 画像を削除するのならこの場所で実施する
        // ※画像が少ないため、現状は削除しない
    }
}
