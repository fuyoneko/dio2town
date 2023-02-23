"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plane = void 0;
const label_texture_1 = require("./label-texture");
const color_1 = require("../../util/color");
const THREE = require("three");
/** 基本図形を描画する */
class Plane {
    /** 板を描画する */
    static drawPlane(scene, p1, p2, height = 0.01, color = color_1.Color.roadBase) {
        // 立方体を作成する
        const geo = new THREE.BoxGeometry(Math.abs(p1.x - p2.x), height, Math.abs(p1.z - p2.z));
        const material = new THREE.MeshStandardMaterial({ color: color.asInteger });
        const plane = new THREE.Mesh(geo, material);
        plane.translateX((p1.x + p2.x) / 2);
        plane.translateY(height / 2);
        plane.translateZ((p1.z + p2.z) / 2);
        scene.add(plane);
        return {
            geo: geo,
            material: material,
            plane: plane,
        };
    }
    /** テクスチャのある板を作成する */
    static drawTexturePlane(scene, text, p1, p2, yPosition = 0.001, fontSize = 17) {
        const width = Math.abs(p1.z - p2.z);
        const height = Math.abs(p1.x - p2.x);
        const geometry = new THREE.PlaneGeometry(width, height);
        const texture = label_texture_1.LabelTexture.createLabelCanvas(text, {
            width: width,
            height: height,
            fontSize: fontSize,
            backgroundColor: color_1.Color.black,
            foregroundColor: color_1.Color.white,
        }, required => required);
        const material = new THREE.MeshBasicMaterial({
            map: new THREE.CanvasTexture(texture),
            alphaMap: new THREE.CanvasTexture(texture),
            alphaTest: 0.1,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.translateX((p1.x + p2.x) / 2);
        plane.translateZ((p1.z + p2.z) / 2);
        plane.translateY(yPosition);
        plane.rotateX(-Math.PI / 2);
        plane.rotateZ(-Math.PI / 2);
        scene.add(plane);
        return plane;
    }
}
exports.Plane = Plane;
