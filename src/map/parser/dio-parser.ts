import { XMLParser } from 'fast-xml-parser';
import { DioData } from './dio-data';

/** Dioファイルの初期化要求データ */
interface DioParserParameter {
  // DioファイルのURL
  dioFile: string;
  // ポリゴンファイルのURL
  polygonFile: string;
}

/** Dioファイルの解析結果 */
export interface DioParseResult {
  // Dioのそれぞれのデータ
  data: DioData[];
  // ポリゴンのそれぞれのデータ
  polygon: PolygonDataType;
}

/** ポリゴン1つが含むデータの詳細 */
interface PolygonDataContentType {
  // ポリゴンの表示倍率
  scale: number;
  // Y方向の配置ポジション
  y: number;
  // 回転角度（degree）
  rotate: number;
  // GLBファイルのコンテンツデータ（Base64）
  // 大量のデータをロードすると時間がかかるため、バンドルして配信する
  glb: string;
}

/** ポリゴンファイルのデータ */
export interface PolygonDataType {
  // ファイルキーとファイル実体の辞書
  [key: string]: PolygonDataContentType;
}

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
   * @param contentsUrl - DrawIoファイル、ポリゴンファイルのパス
   */
  async parse(contentsUrl: DioParserParameter): Promise<DioParseResult> {
    // 読み込みを行う
    const dioResult = await fetch(contentsUrl.dioFile);
    // テキスト形式（XML）で取得する
    const dioData = await dioResult.text();
    // ポリゴンの読み込みを行う
    const polygonResult = await fetch(contentsUrl.polygonFile);
    // JSON形式で取得する
    const polygonData: PolygonDataType = await polygonResult.json();
    // 結果をパースする
    let result: Array<DioData> = [];
    try {
      // XMLでパースを実施
      const parser = new XMLParser({ ignoreAttributes: false });
      const parsed = parser.parse(dioData);
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
    return {
      data: result,
      polygon: polygonData,
    };
  }
}
