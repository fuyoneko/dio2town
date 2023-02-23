/**
 * 色情報を管理する
 */
export declare class ColorWrapper {
    private _red;
    private _green;
    private _blue;
    private _alpha?;
    /** コンストラクタ */
    constructor(red: number, green: number, blue: number, alpha?: number | undefined);
    /** 整数として取得する */
    get asInteger(): number;
    /** 文字列として取得する */
    get asString(): string;
}
export declare const Color: {
    /** 赤色 */
    red: ColorWrapper;
    /** 黄色 */
    yellow: ColorWrapper;
    /** 明るい灰色 */
    lightGrey: ColorWrapper;
    /** 暗い灰色 */
    darkGrey: ColorWrapper;
    /** テキストカラー */
    text: ColorWrapper;
    /** 白色 */
    white: ColorWrapper;
    /** 透明 */
    clear: ColorWrapper;
    /** 黒色 */
    black: ColorWrapper;
    /** ビルの基礎色 */
    buildingBase: ColorWrapper;
    /** 道の基礎色 */
    roadBase: ColorWrapper;
    /** フロアの基礎色 */
    floorBase: ColorWrapper;
};
