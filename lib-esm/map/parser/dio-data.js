/* eslint-disable no-new-wrappers */
/**
 * Dioのデータを読み取る
 */
class DataContainer {
    /**
     * コンストラクタ
     *
     * @param item - Dioのデータアイテム
     * @param key - データアイテムにアクセスするためのキー
     * @param defaults - アクセスできなかった場合に設定する値
     * @param converter - 変換関数
     */
    constructor(item, key, defaults, converter) {
        this._item = item;
        this._key = key;
        this._defaults = defaults;
        this._converter = converter;
    }
    /** キーをもとに、値を設定する */
    parseTarget(item, key, converter) {
        let target = item[key];
        let isReturnDefault = false;
        if (target === undefined) {
            isReturnDefault = true;
            target = '';
        }
        return {
            isReturnDefault,
            target: new String(converter(target)),
        };
    }
    /** 型のない状態で、格納された値を返却する */
    value() {
        const parsed = this.parseTarget(this._item, this._key, this._converter);
        const target = parsed.target;
        const isReturnDefault = parsed.isReturnDefault;
        if (this._defaults instanceof String) {
            return isReturnDefault ? this._defaults.valueOf() : target.valueOf();
        }
        if (this._defaults instanceof Number && target.includes('.')) {
            if (isReturnDefault)
                return this._defaults.valueOf();
            return parseFloat(target.valueOf());
        }
        if (this._defaults instanceof Number) {
            if (isReturnDefault)
                return this._defaults.valueOf();
            return parseInt(target.valueOf());
        }
        if (this._defaults instanceof Boolean) {
            if (isReturnDefault)
                return this._defaults.valueOf();
            return target.valueOf() == 'True' ? true : false;
        }
        if (this._defaults)
            return this._defaults;
    }
    /** Booleanとして、格納された値を返却する */
    get asBoolean() {
        return this.value();
    }
    /** Stringとして、格納された値を返却する */
    get asString() {
        return this.value();
    }
    /** Numberとして、格納された値を返却する */
    get asNumber() {
        return this.value();
    }
    /** CSSのスタイルとして、格納された値を返却する */
    get asStyleMap() {
        const result = {};
        this.asString.split(';').forEach(item => {
            const kv = item.trim().split('=');
            if (kv.length == 2) {
                const key = kv[0];
                const value = kv[1];
                result[key] = value;
            }
        });
        return result;
    }
}
/**
 * Dioからデータを読み込む
 */
export class DioData {
    /** コンストラクタ */
    constructor(input) {
        // コメント
        this.comment = '';
        // ラベル（オブジェクトに表示するテキスト、プロパティ設定不要）
        this.label = '';
        // 読み仮名
        this.yomi = '';
        // ひらがなフラグ
        this.hiragana = false;
        // データタイプ
        this.type = '';
        // 一括選択時のインデックス
        this.index = '';
        // 座標情報
        this.x = [];
        this.y = [];
        // 高さ
        this.height = 0.0;
        // スケール
        this.scale = 1.0;
        // フォントサイズ
        this.fontSize = 17;
        // 回転角度
        this.rotate = 0.0;
        // 画像データのパス
        this.image = '';
        // 視点位置
        this.stands = [];
        // パネルの非表示フラグ
        this.invisible = false;
        // トースト詳細のタイトル
        this.docTitle = '';
        // トースト詳細のテキスト
        this.docText = '';
        // 道案内情報のインデックス
        this.iterator = '';
        // オフセット情報
        this.offset = [0, 0, 0, 0];
        // 詳細表示時のオブジェクト3Dデータ
        this.lod2 = '';
        // パラメータからデータをコピーする
        this.comment = input.comment.asString;
        this.label = input.label.asString;
        this.yomi = input.yomi.asString;
        this.hiragana = input.hiragana.asBoolean;
        this.type = input.type.asString;
        this.index = input.index.asString;
        this.height = input.height.asNumber;
        this.x = [input.x.asNumber, input.x.asNumber + input.width.asNumber];
        this.y = [input.z.asNumber, input.z.asNumber + input.vertical.asNumber];
        this.scale = input.scale.asNumber;
        this.rotate = input.rotate.asNumber;
        this.image = input.image.asString;
        this.fontSize = input.fontSize.asNumber;
        this.stands = [
            input.standsX.asNumber,
            input.standsY.asNumber,
            input.standsZ.asNumber,
        ];
        this.invisible = input.invisible.asBoolean;
        this.docTitle = input.docTitle.asString;
        this.docText = input.docText.asString;
        this.iterator = input.iterator.asString;
        this.lod2 = input.lod2.asString;
    }
    /**
     * データを作成するファクトリ
     *
     * @param item - Dioファイルのデータ
     */
    static createFromDioData(item) {
        // 定数：変換なし
        const NO_CONVERT = value => value;
        // 定数：GL座標に変換する
        const CONVERT_GEOMETRY = point => {
            const pointValue = parseFloat(point);
            return new String(pointValue * 0.0025).valueOf();
        };
        // 座標情報を取得する
        const position = item.mxCell.mxGeometry;
        // スタイル情報をDioから取得する
        const style = new DataContainer(item.mxCell, '@_style', new String(''), NO_CONVERT).asStyleMap;
        // データを取得、設定する
        return new DioData({
            // コメントを取得する
            comment: new DataContainer(item, '@_comment', new String(''), NO_CONVERT),
            // ラベルを取得する
            label: new DataContainer(item, '@_label', new String(''), NO_CONVERT),
            // 読み仮名を取得する
            yomi: new DataContainer(item, '@_yomi', new String(''), NO_CONVERT),
            // ひらがなフラグを取得する
            hiragana: new DataContainer(item, '@_hiragana', new Boolean(false), NO_CONVERT),
            // タイプを取得する
            type: new DataContainer(item, '@_type', new String(''), NO_CONVERT),
            // 一括選択用のインデックスを取得する
            index: new DataContainer(item, '@_index', new String(''), NO_CONVERT),
            // 座標情報を取得する（Dioデータの座標系から、GLの座標系に変換する）
            x: new DataContainer(position, '@_x', new Number(0.0), CONVERT_GEOMETRY),
            z: new DataContainer(position, '@_y', new Number(0.0), CONVERT_GEOMETRY),
            // 幅を取得する
            width: new DataContainer(position, '@_width', new Number(0.0), CONVERT_GEOMETRY),
            // 高さを取得する
            vertical: new DataContainer(position, '@_height', new Number(0.0), CONVERT_GEOMETRY),
            // 床面高さを取得する（未使用）
            floor: new DataContainer(item, 'anyanyany', new Number(0.0), NO_CONVERT),
            // 高さを取得する
            height: new DataContainer(item, '@_height', new Number(0.0), NO_CONVERT),
            // スケール倍率を取得する
            scale: new DataContainer(item, '@_scale', new Number(1.0), NO_CONVERT),
            // フォントサイズを取得する
            fontSize: new DataContainer(item, '@_font_size', new Number(17.0), NO_CONVERT),
            // 回転角度を取得する
            rotate: new DataContainer(style, 'rotation', new Number(0), NO_CONVERT),
            // 画像のパスを取得する
            image: new DataContainer(item, '@_image', new String(''), NO_CONVERT),
            // 視点情報を取得する
            standsX: new DataContainer(item, '@_stands_x', new Number(0.1), NO_CONVERT),
            standsY: new DataContainer(item, '@_stands_y', new Number(0.1), NO_CONVERT),
            standsZ: new DataContainer(item, '@_stands_z', new Number(0.1), NO_CONVERT),
            // 非表示フラグを取得する
            invisible: new DataContainer(item, '@_invisible', new Boolean(false), NO_CONVERT),
            // トーストの表示タイトルを取得する
            docTitle: new DataContainer(item, '@_doc_title', new String(''), NO_CONVERT),
            // トーストの表示情報を取得する
            docText: new DataContainer(item, '@_doc_text', new String(''), NO_CONVERT),
            // 道案内のイテレータを取得する
            iterator: new DataContainer(item, '@_iterator', new String(''), NO_CONVERT),
            // 詳細表示時の3Dオブジェクトの情報を取得する
            lod2: new DataContainer(item, '@_lod2', new String(''), NO_CONVERT),
        });
    }
}
