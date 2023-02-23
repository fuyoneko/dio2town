/**
 * Dioのデータを読み取る
 */
declare class DataContainer<T> {
    _item: any;
    _key: string;
    _defaults: T;
    _converter: (string: any) => string;
    /**
     * コンストラクタ
     *
     * @param item - Dioのデータアイテム
     * @param key - データアイテムにアクセスするためのキー
     * @param defaults - アクセスできなかった場合に設定する値
     * @param converter - 変換関数
     */
    constructor(item: any, key: string, defaults: T, converter: (string: any) => string);
    /** キーをもとに、値を設定する */
    parseTarget(item: any, key: string, converter: (string: any) => string): {
        isReturnDefault: boolean;
        target: String;
    };
    /** 型のない状態で、格納された値を返却する */
    value(): any;
    /** Booleanとして、格納された値を返却する */
    get asBoolean(): boolean;
    /** Stringとして、格納された値を返却する */
    get asString(): string;
    /** Numberとして、格納された値を返却する */
    get asNumber(): number;
    /** CSSのスタイルとして、格納された値を返却する */
    get asStyleMap(): {};
}
/**
 * Dioからデータを読み込むフォーマット
 */
interface DioDataInput {
    comment: DataContainer<String>;
    label: DataContainer<String>;
    yomi: DataContainer<String>;
    hiragana: DataContainer<Boolean>;
    type: DataContainer<String>;
    index: DataContainer<String>;
    x: DataContainer<Number>;
    z: DataContainer<Number>;
    width: DataContainer<Number>;
    vertical: DataContainer<Number>;
    floor: DataContainer<Number>;
    height: DataContainer<Number>;
    scale: DataContainer<Number>;
    fontSize: DataContainer<Number>;
    rotate: DataContainer<Number>;
    image: DataContainer<String>;
    standsX: DataContainer<Number>;
    standsY: DataContainer<Number>;
    standsZ: DataContainer<Number>;
    invisible: DataContainer<Boolean>;
    docTitle: DataContainer<String>;
    docText: DataContainer<String>;
    iterator: DataContainer<String>;
    lod2: DataContainer<String>;
}
/**
 * Dioからデータを読み込む
 */
export declare class DioData {
    comment: string;
    label: string;
    yomi: string;
    hiragana: boolean;
    type: string;
    index: string;
    x: Array<number>;
    y: Array<number>;
    height: number;
    scale: number;
    fontSize: number;
    rotate: number;
    image: string;
    stands: Array<number>;
    invisible: boolean;
    docTitle: string;
    docText: string;
    iterator: string;
    offset: Array<number>;
    lod2: string;
    /** コンストラクタ */
    constructor(input: DioDataInput);
    /**
     * データを作成するファクトリ
     *
     * @param item - Dioファイルのデータ
     */
    static createFromDioData(item: any): DioData;
}
export {};
