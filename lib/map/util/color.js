"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = exports.ColorWrapper = void 0;
/**
 * 色情報を管理する
 */
class ColorWrapper {
    /** コンストラクタ */
    constructor(red, green, blue, alpha = undefined) {
        this._red = red;
        this._green = green;
        this._blue = blue;
        this._alpha = alpha;
    }
    /** 整数として取得する */
    get asInteger() {
        return (this._red << 16) + (this._green << 8) + this._blue;
    }
    /** 文字列として取得する */
    get asString() {
        if (this._alpha) {
            return `rgba(${this._red}, ${this._green}, ${this._blue}, ${this._alpha})`;
        }
        return `rgb(${this._red}, ${this._green}, ${this._blue})`;
    }
}
exports.ColorWrapper = ColorWrapper;
exports.Color = {
    /** 赤色 */
    red: new ColorWrapper(0xff, 0, 0),
    /** 黄色 */
    yellow: new ColorWrapper(0xff, 0xff, 0),
    /** 明るい灰色 */
    lightGrey: new ColorWrapper(230, 230, 250),
    /** 暗い灰色 */
    darkGrey: new ColorWrapper(0x33, 0x33, 0x33),
    /** テキストカラー */
    text: new ColorWrapper(0x22, 0x22, 0x22),
    /** 白色 */
    white: new ColorWrapper(0xff, 0xff, 0xff),
    /** 透明 */
    clear: new ColorWrapper(0x00, 0x00, 0x00, 0.0),
    /** 黒色 */
    black: new ColorWrapper(0, 0, 0),
    /** ビルの基礎色 */
    buildingBase: new ColorWrapper(0x6f, 0x54, 0x36),
    /** 道の基礎色 */
    roadBase: new ColorWrapper(100, 40, 40),
    /** フロアの基礎色 */
    floorBase: new ColorWrapper(115, 115, 115),
};
