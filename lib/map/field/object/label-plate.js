"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelPlate = void 0;
const THREE = require("three");
const label_texture_1 = require("./label-texture");
/** テキストラベルを管理するクラス */
class LabelPlate {
    /** テクスチャの向きに合わせて法線を設定する */
    convertToUV() {
        const TOP_LEFT_UV = [0.0, 0.0];
        const TOP_RIGHT_UV = [1.0, 0.0];
        const BOTTOM_LEFT_UV = [0.0, 1.0];
        const BOTTOM_RIGHT_UV = [1.0, 1.0];
        return [
            ...TOP_LEFT_UV,
            ...TOP_RIGHT_UV,
            ...BOTTOM_LEFT_UV,
            //
            ...BOTTOM_RIGHT_UV,
            ...BOTTOM_LEFT_UV,
            ...TOP_RIGHT_UV,
        ];
    }
    /** 四角形を頂点情報に変換する */
    rectangleToVertex(x1, x2, z1, z2, y) {
        return [
            //
            ...[x1, y, z1],
            ...[x1, y, z2],
            ...[x2, y, z1],
            //
            ...[x2, y, z2],
            ...[x2, y, z1],
            ...[x1, y, z2],
        ];
    }
    /** フォントサイズをGL空間上の大きさに変換する */
    convertFontSizeToGlSize(fontSize) {
        // 17ptをGL空間上の0.033とする
        return 0.033 * (fontSize / 17);
    }
    /** テキストラベルを作成する */
    createLabel(property) {
        // ラベルサイズを計算する
        const labelSize = label_texture_1.LabelTexture.contextMeasureText(property.label, property.fontSize);
        // ラベルのアスペクト比
        const glFontSize = this.convertFontSizeToGlSize(property.fontSize);
        const labelAspect = labelSize.width / labelSize.actualBoundingBoxAscent;
        // ベースメントのサイズ
        const basementWidth = Math.abs(property.z1 - property.z2);
        const basementHeight = Math.abs(property.x1 - property.x2);
        // テキストの描画方向を決定する
        let width = glFontSize * labelAspect;
        let height = glFontSize;
        if (basementWidth < width && basementHeight < width) {
            // 縦、横のどちらで描画してもはみ出るのなら、長いほうを参照する
            const aspect = width / Math.max(basementWidth, basementHeight);
            if (basementWidth < basementHeight) {
                // widthのほうが短いなら、縦書きとして扱う
                // 高さを目いっぱいに扱うため、basementHeightにあわせる
                width = height * aspect;
                height = basementHeight;
            }
            else {
                // 横書きなら、そのまま縮小する
                width = basementWidth;
                height = height * aspect;
            }
        }
        else if (basementWidth < basementHeight) {
            // 幅を超えるのなら、縦書きに変換する
            const temp = width;
            width = height;
            height = temp;
        }
        // オフセット位置を取得する
        const xOffset = (Math.abs(property.x1 - property.x2) - height) / 2;
        const zOffset = (Math.abs(property.z1 - property.z2) - width) / 2;
        // 文字テクスチャを作成する
        const texture = label_texture_1.LabelTexture.createLabelCanvas(property.label, {
            width: width,
            height: height,
            fontSize: property.fontSize,
            backgroundColor: property.backgroundColor,
        }, required => required);
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(texture),
        });
        // 四角形のパネルを作成する
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.rectangleToVertex(property.x1 + xOffset, property.x1 + height + xOffset, property.z1 + zOffset, property.z1 + width + zOffset, property.y + 0.0001)), 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(this.convertToUV()), 2));
        return new THREE.Mesh(geometry, material);
    }
    /** テキストラベルの背景パネルを作成する */
    createBasement(property) {
        // 四角形のパネルを作成する
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.rectangleToVertex(property.x1, property.x2, property.z1, property.z2, property.y)), 3));
        // 光源の影響を受けないマテリアル（MeshBasicMaterial）を設定する
        return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: property.backgroundColor.asInteger,
        }));
    }
    /** コンストラクタ */
    constructor(property) {
        try {
            // パネルにテクスチャを適用する
            this._plane = this.createLabel(property);
            this._basement = this.createBasement(property);
        }
        catch (err) {
            // 作成に失敗したのなら空のオブジェクトを設定する
            this._plane = new THREE.Mesh();
            this._basement = new THREE.Mesh();
            this._plane.scale.set(0, 0, 0);
            this._basement.scale.set(0, 0, 0);
            // エラーログの出力
            console.error(err);
        }
    }
    /** テキストラベルを返却する */
    get plane() {
        return this._plane;
    }
    /** テキストラベルの背景パネルを返却する */
    get basement() {
        return this._basement;
    }
}
exports.LabelPlate = LabelPlate;
