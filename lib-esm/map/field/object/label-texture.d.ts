import { ColorWrapper } from '../../../map/util/color';
/** テクスチャラベルの初期化情報 */
interface LabelContextWrapperParameter {
    height: number;
    width: number;
    foregroundColor?: ColorWrapper | null;
    backgroundColor?: ColorWrapper | null;
    fontSize: number;
    resolution?: number;
    glToCanvasScale?: number;
    lineSpace?: number;
}
/**
 * テクスチャラベルのファクトリ
 * LabelContextをラップする
 */
export declare class LabelTexture {
    /**
     * ラベルを作成する
     *
     * @param text - 描画するテキスト
     * @param parameter - 描画情報（色など）
     * @param direction - 描画方向（"yoko"を返却すると横書きになる。(result) =\> resultを指定すると自動設定になる）
     */
    static createLabelCanvas(text: string, parameter: LabelContextWrapperParameter, direction: (string: any) => string): HTMLCanvasElement;
    /**
     * テキストの描画サイズを計算、返却する
     *
     * @param text - 描画予定のテキスト
     * @param fontSize - フォントサイズ（標準は17）
     * @returns TextMetrics - テキストの描画ボックスサイズ
     */
    static contextMeasureText(text: string, fontSize: number): TextMetrics;
}
export {};
