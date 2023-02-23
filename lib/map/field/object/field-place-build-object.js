"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldPlaceBuildingObject = void 0;
/** 詳細表示用のオブジェクト */
class FieldPlaceBuildingObject {
    /** コンストラクタ */
    constructor() {
        this._lazyLoadBuildingScale = 1.0;
    }
    /** 表示サイズを返却する */
    get lazyLoadBuildingScale() {
        return this._lazyLoadBuildingScale;
    }
    /** 詳細表示用のオブジェクトをコンテンツとして設定する */
    withContents(lazyLoadBuilding, labelSprite) {
        this._lazyLoadBuilding = lazyLoadBuilding;
        this._labelSprite = labelSprite;
        return this;
    }
    /** 早期読み込み用の立方体を、実際に読み込んだLOD2のオブジェクトに置き換える */
    replaceLazyLoadBuilding(scene, lazyLoadBuilding, scale, rotate, yPosition) {
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
    accessToLazyLoadBuilding(accessor) {
        if (this._lazyLoadBuilding) {
            accessor(this._lazyLoadBuilding, this._labelSprite);
        }
    }
}
exports.FieldPlaceBuildingObject = FieldPlaceBuildingObject;
