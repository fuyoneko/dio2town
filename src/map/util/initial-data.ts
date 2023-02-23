/** URLクエリなどから、初期化に必要な情報を取得する */
export class InitialData {
  /**
   * URLパスを作成する
   *
   * @param domain - ドメイン
   * @param flag - 表示画面のフラグ
   * @param outputValue - 最初に表示するデータ名
   */
  static output(domain, flag, outputValue) {
    const value = encodeURIComponent(JSON.stringify(outputValue.label));
    const parameter = [
      // 情報をURLクエリに設定する
      `flag=${flag}`,
      `value=${value}`,
      // LINEで表示するために、openExternalBrowserの指定をする
      'openExternalBrowser=1',
    ].join('&');
    return `${domain}?${parameter}`;
  }

  /** 連携された情報を読み込む */
  static load(callback) {
    // パスを取得する
    const path = location.href;
    // パスからクエリを取得する
    const queryComponents = path.split('?');
    if (queryComponents.length <= 1) {
      // ドメインしかない（クエリがない）なら終了する
      return;
    }
    // クエリを取得する
    const query = queryComponents[1];
    // クエリをパラメータに格納する
    const parameters = {};
    query.split('&').forEach(item => {
      const seps = item.split('=');
      if (seps.length >= 2) {
        parameters[seps[0]] = seps[1];
      }
    });
    // パラメータを検査、正しくデータが格納されているのなら
    // 引数のコールバック関数を実行する
    if (parameters['flag'] && parameters['value']) {
      const values: string = parameters['value'];
      const buffer = decodeURIComponent(values);
      /** */
      callback({
        flag: parameters['flag'],
        value: JSON.parse(buffer),
      });
    }
  }
}
