import { Color, ColorWrapper } from '../../../map/util/color';

/** テクスチャラベルの初期化情報 */
interface LabelContextWrapperParameter {
  // 高さ
  height: number;
  // 幅
  width: number;
  // 文字色
  foregroundColor?: ColorWrapper | null;
  // 背景色
  backgroundColor?: ColorWrapper | null;
  // フォントサイズ
  fontSize: number;
  // 解像度
  resolution?: number;
  // GLをキャンバスサイズに置き換える大きさ
  glToCanvasScale?: number;
  // 文字スペース
  lineSpace?: number;
}

/** テクスチャラベルを作成する */
class LabelContextWrapper {
  _result: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D;
  _parameter: LabelContextWrapperParameter;
  /** コンストラクタ */
  constructor(parameter: LabelContextWrapperParameter) {
    // パラメータを保持する
    this._parameter = parameter;

    // ラベルはCanvas要素で作成する
    const canvasForText = document.createElement('canvas');
    // 2D要素をCanvasから取り出す
    this._ctx =
      canvasForText.getContext('2d') ?? new CanvasRenderingContext2D();
    // Canvasに大きさを設定する
    this._ctx.canvas.width = this.width;
    this._ctx.canvas.height = this.height;

    // 背景色を設定する
    if (parameter.backgroundColor) {
      this._ctx.fillStyle = parameter.backgroundColor.asString;
      this._ctx.fillRect(0, 0, this.width, this.height);
    }
    // フォントを設定する
    this._ctx.fillStyle =
      parameter.foregroundColor?.asString ?? Color.text.asString;
    this._ctx.font = `${this.fontSize}px sans-serif`;

    // キャンバスを結果として格納する
    this._result = canvasForText;
  }

  /** GLをキャンバスサイズに置き換える大きさ */
  get glToCanvasScale() {
    return this._parameter.glToCanvasScale ?? 500.0;
  }

  /** 解像度 */
  get resolution() {
    return this._parameter.resolution ?? 2.0;
  }

  /** フォントサイズ */
  get fontSize() {
    return this._parameter.fontSize * this.resolution;
  }

  /** 文字スペース */
  get lineSpace() {
    return this._parameter.fontSize * 0.3 * this.resolution;
  }

  /** 幅 */
  get width() {
    return this._parameter.width * this.resolution * this.glToCanvasScale;
  }

  /** 高さ */
  get height() {
    return this._parameter.height * this.resolution * this.glToCanvasScale;
  }

  /**
   * 描画後のCanvasの幅を返却する
   *
   * @param text - 描画予定のテキスト
   */
  measureWidth(text: string) {
    return this._ctx.measureText(text).width;
  }

  /**
   * 描画後のCanvasの高さを返却する
   *
   * @param text - 描画予定のテキスト
   */
  measureHeight(text: string) {
    return this._ctx.measureText(text).actualBoundingBoxAscent;
  }

  /**
   *  水平方向にテキストを描画する
   *
   * @param text - 描画するテキスト
   */
  drawTextToHorizontal(text: string) {
    this._ctx.fillText(
      text,
      // x方向の余白/2をx方向開始時の始点とすることで、横方向の中央揃えをしている。
      (this.width - this.measureWidth(text)) / 2,
      // y方向のcanvasの中央に文字の高さの半分を加えることで、縦方向の中央揃えをしている。
      this.height / 2 + this.measureHeight(text) / 2
    );
    return this;
  }

  /**
   *  縦書き方向にテキストを描画する
   *
   * @param text - 描画するテキスト
   */
  drawTextToVertical(text: string) {
    // 描画後のテキストの高さを求める
    let totalHeight = 0;
    for (let index = 0; index < text.length; index++) {
      const c = text[index];
      if (index < text.length - 1) {
        totalHeight += this.measureHeight(c) + this.lineSpace;
      } else {
        totalHeight += this.measureHeight(c);
      }
    }
    // 文字の高さを取得する
    let yPosition = (this.height - totalHeight) / 2;
    for (const c of text) {
      this._ctx.fillText(
        c,
        // x方向の余白/2をx方向開始時の始点とすることで、横方向の中央揃えをしている。
        (this.width - this.measureWidth(c)) / 2,
        // y方向のcanvasの中央に文字の高さの半分を加えることで、縦方向の中央揃えをしている。
        yPosition + this.measureHeight(c) - this.lineSpace / 2
      );
      yPosition += this.measureHeight(c) + this.lineSpace;
    }
    return this;
  }

  /**
   * 描画結果のキャンバスを返却する
   *
   * @returns HTMLCanvasElement - 描画結果のコンテキスト
   */
  get result() {
    return this._result;
  }
}

/**
 * テクスチャラベルのファクトリ
 * LabelContextをラップする
 */
export class LabelTexture {
  /**
   * ラベルを作成する
   *
   * @param text - 描画するテキスト
   * @param parameter - 描画情報（色など）
   * @param direction - 描画方向（"yoko"を返却すると横書きになる。(result) =\> resultを指定すると自動設定になる）
   */
  static createLabelCanvas(
    text: string,
    parameter: LabelContextWrapperParameter,
    direction: (string) => string
  ) {
    const wrapper = new LabelContextWrapper(parameter);
    const directionRequired =
      parameter.width >= parameter.height ? 'yoko' : 'tate';
    if (direction(directionRequired) == 'yoko') {
      wrapper.drawTextToHorizontal(text);
    } else {
      wrapper.drawTextToVertical(text);
    }
    return wrapper.result;
  }

  /**
   * テキストの描画サイズを計算、返却する
   *
   * @param text - 描画予定のテキスト
   * @param fontSize - フォントサイズ（標準は17）
   * @returns TextMetrics - テキストの描画ボックスサイズ
   */
  static contextMeasureText(text: string, fontSize: number) {
    const canvasForText = document.createElement('canvas');
    const ctx =
      canvasForText.getContext('2d') ?? new CanvasRenderingContext2D();
    ctx.canvas.width = 100;
    ctx.canvas.height = 100;
    ctx.font = `${fontSize}px sans-serif`;
    return ctx.measureText(text);
  }
}
