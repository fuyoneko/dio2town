import { XMLParser } from 'fast-xml-parser';
import { DioData } from './dio-data';

/**
 * DrawIoからデータをパースする
 */
export class DioParser {
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
    const data = DioData.createFromDioData(item);
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
  async parse(fileUrl: string) {
    // 読み込みを行う
    const res = await fetch(fileUrl);
    // テキスト形式（XML）で取得する
    const data = await res.text();
    // 結果をパースする
    let result: Array<DioData> = [];
    try {
      // XMLでパースを実施
      const parser = new XMLParser({ ignoreAttributes: false });
      const parsed = parser.parse(data);
      // ファイルからrootオブジェクトを取得する
      const graphModel = parsed.mxfile.diagram.mxGraphModel.root;
      // 全オブジェクトをパース処理する
      result = graphModel.object
        .filter(DioParser.filterExpression)
        .map(DioParser.parseExpression);
    } catch (e) {
      console.log(e);
      console.log('Parse Error');
    }
    return result;
  }
}
