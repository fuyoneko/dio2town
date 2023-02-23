import { DioData } from './dio-data';
/**
 * DrawIoからデータをパースする
 */
export declare class DioParser {
    /**
     * フィルタ条件
     * パースしない項目があれば、その条件を設定する
     */
    static filterExpression(item: any): boolean;
    /**
     * パース処理
     * createFromDioDataでパースをする
     * もし追加処理が必要ならこの中で行う
     */
    static parseExpression(item: any): DioData;
    /**
     * パース処理の実行
     *
     * @param fileUrl - DrawIoファイルのパス
     */
    parse(fileUrl: string): Promise<DioData[]>;
}
