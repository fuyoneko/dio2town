/**
 * 色情報を管理する
 */
export class ColorWrapper {
  // 赤色（0 ~ 255）
  private _red: number;
  // 緑色（0 ~ 255）
  private _green: number;
  // 青色（0 ~ 255）
  private _blue: number;
  // 透明度（0 ~ 1.0
  private _alpha?: number;

  /** コンストラクタ */
  constructor(
    red: number,
    green: number,
    blue: number,
    alpha: number | undefined = undefined
  ) {
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

export const Color = {
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
