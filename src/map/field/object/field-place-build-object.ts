import type * as THREE from 'three';

/** 詳細表示用のオブジェクト */
export class FieldPlaceBuildingObject {
  // 先行読み込みをする簡単なオブジェクト
  private _lazyLoadBuilding?: THREE.Object3D;
  // 詳細表示時に表示するスプライト型の文字ラベル
  private _labelSprite?: THREE.Sprite;
  // 表示サイズ
  private _lazyLoadBuildingScale: number;

  /** コンストラクタ */
  constructor() {
    this._lazyLoadBuildingScale = 1.0;
  }

  /** 表示サイズを返却する */
  get lazyLoadBuildingScale() {
    return this._lazyLoadBuildingScale;
  }

  /** 詳細表示用のオブジェクトをコンテンツとして設定する */
  withContents(lazyLoadBuilding: THREE.Object3D, labelSprite: THREE.Sprite) {
    this._lazyLoadBuilding = lazyLoadBuilding;
    this._labelSprite = labelSprite;
    return this;
  }

  /** 早期読み込み用の立方体を、実際に読み込んだLOD2のオブジェクトに置き換える */
  replaceLazyLoadBuilding(
    scene: THREE.Scene,
    lazyLoadBuilding: THREE.Object3D,
    scale: number,
    rotate: number,
    yPosition?: number
  ) {
    if (this._lazyLoadBuilding) {
      // 位置情報をコピーする
      lazyLoadBuilding.position.copy(this._lazyLoadBuilding.position);
      lazyLoadBuilding.scale.set(scale, scale, scale);
      lazyLoadBuilding.rotateY((rotate / 180) * Math.PI);
      // 古いオブジェクトを削除する
      scene.remove(this._lazyLoadBuilding);
      this._lazyLoadBuilding = undefined;
    }
    if (yPosition !== undefined) {
      // y座標を入力した値に変更する
      lazyLoadBuilding.position.setY(yPosition);
    }
    // 新しいオブジェクトを登録する
    scene.add(lazyLoadBuilding);
    this._lazyLoadBuilding = lazyLoadBuilding;
    this._lazyLoadBuildingScale = scale;
  }

  /** base64のデータをバイナリ形式で読み込む */
  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /** オブジェクトが存在すればアクセスする */
  accessToLazyLoadBuilding(
    accessor: (
      lazyLoadBuilding: THREE.Object3D,
      labelSprite: THREE.Sprite
    ) => void
  ) {
    if (this._lazyLoadBuilding) {
      accessor(this._lazyLoadBuilding!, this._labelSprite!);
    }
  }
}
