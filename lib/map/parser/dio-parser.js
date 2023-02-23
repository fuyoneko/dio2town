"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DioParser = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const dio_data_1 = require("./dio-data");
/**
 * DrawIoからデータをパースする
 */
class DioParser {
    /**
     * フィルタ条件
     * パースしない項目があれば、その条件を設定する
     */
    static filterExpression(item) {
        // 全てのデータをパースする
        return true;
    }
    /**
     * パース処理
     * createFromDioDataでパースをする
     * もし追加処理が必要ならこの中で行う
     */
    static parseExpression(item) {
        const data = dio_data_1.DioData.createFromDioData(item);
        // 建物にオフセットを加えて隙間を作る
        if (data.type.includes('building')) {
            data.offset = [0.002, 0.002, 0.002, 0.002];
        }
        data.x[0] += data.offset[0];
        data.y[0] += data.offset[1];
        data.x[1] -= data.offset[2];
        data.x[1] -= data.offset[3];
        return data;
    }
    /**
     * パース処理の実行
     *
     * @param fileUrl - DrawIoファイルのパス
     */
    parse(fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            // 読み込みを行う
            const res = yield fetch(fileUrl);
            // テキスト形式（XML）で取得する
            const data = yield res.text();
            // 結果をパースする
            let result = [];
            try {
                // XMLでパースを実施
                const parser = new fast_xml_parser_1.XMLParser({ ignoreAttributes: false });
                const parsed = parser.parse(data);
                // ファイルからrootオブジェクトを取得する
                const graphModel = parsed.mxfile.diagram.mxGraphModel.root;
                // 全オブジェクトをパース処理する
                result = graphModel.object
                    .filter(DioParser.filterExpression)
                    .map(DioParser.parseExpression);
            }
            catch (e) {
                console.log(e);
                console.log('Parse Error');
            }
            return result;
        });
    }
}
exports.DioParser = DioParser;
