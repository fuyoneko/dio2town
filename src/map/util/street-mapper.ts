// 通りの名前を定義する
const IndexDefines = {
  main: 'メイン通り',
  young: '青春通り',
  daimon: '大門通り',
  hyakuban: '百番通り',
  hashi: '端通り',
  yayoi: '弥生町会',
  wakana: '若菜町会',
};
// 主要通りに印をつける
const MainStreetDefine = {
  main: true,
  young: true,
  daimon: true,
};

/** 通りの情報を管理する */
export class StreetMapper {
  /** インデックスを取得する */
  static indexToString(index: string) {
    if (index in IndexDefines) {
      return IndexDefines[index];
    }
    return '-';
  }
  /** カテゴリからインデックスに合う情報を取得する */
  static indexToCategory(index: string) {
    if (index in MainStreetDefine) {
      return '主要';
    }
    return '裏通り';
  }
}
