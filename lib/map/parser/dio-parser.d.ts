import { DioData } from './dio-data';
/** Dioファイルの初期化要求データ */
interface DioParserParameter {
    dioFile: string;
    polygonFile: string;
}
/** Dioファイルの解析結果 */
export interface DioParseResult {
    data: DioData[];
    polygon: PolygonDataType;
}
/** ポリゴン1つが含むデータの詳細 */
interface PolygonDataContentType {
    scale: number;
    y: number;
    rotate: number;
    glb: string;
}
/** ポリゴンファイルのデータ */
export interface PolygonDataType {
    [key: string]: PolygonDataContentType;
}
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
     * @param contentsUrl - DrawIoファイル、ポリゴンファイルのパス
     */
    parse(contentsUrl: DioParserParameter): Promise<DioParseResult>;
}
export {};
