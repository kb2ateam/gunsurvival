import Animation from "/animation/Animation.js";
// import {random} from "../../helpers/common.js";

export default class Camera extends Animation {
	constructor(config = {}) {
		config = Object.assign({
				name: "Camera"
			},
			config
		);
		super(config);
		this.isShaking = false;
		this.speedMove = 0.01
		// this.prefix = new SAT.Vector();
	}

	update(sketch, animation) {
		super.update(sketch);
		sketch.translate(-this.pos.x * this.scale, -this.pos.y * this.scale);
		sketch.rotate(this.rotate);
		sketch.translate(sketch.width * 0.5, sketch.height * 0.5);
		sketch.scale(this.scale);
		sketch.smooth();
		animation.update();
		animation.draw(sketch)
	}

	shake(noise) {
		if (this.isShaking) return;
		this.pos.x = this.pos.x + random(-noise, noise);
		this.pos.y = this.pos.y + random(-noise, noise);
	}

	// Chuyển đổi vị trí thực của vật thể (theo hệ toạ độ của mapgame) về vị trí trên màn hình (theo hệ toạ độ màn hình)
	worldToScreen(sketch, worldPos, center = false) {
		return {
			x: (worldPos.x - this.pos.x) * this.scale + sketch.width * .5 * center,
			y: (worldPos.y - this.pos.y) * this.scale + sketch.height * .5 * center
		};
	}

	// Ngược lại của worldToScreen()
	screenToWorld(sketch, screenPos, center = false) {
		return {
			x: (screenPos.x - sketch.width * .5 * center) / this.scale + this.pos.x,
			y: (screenPos.y - sketch.height * .5 * center) / this.scale + this.pos.y
		};
	}
}

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}