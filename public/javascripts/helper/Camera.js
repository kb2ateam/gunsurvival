import Animation from "/animation/Animation.js";
// import {random} from "../../helpers/common.js";

export default class Camera extends Animation {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Camera"
			},
			config
		);
		super(config);
		this.isShaking = false;
		// this.prefix = new SAT.Vector();
	}

	update(sketch, animation) {
		super.update(sketch);
		sketch.translate(-this.pos.x * this.scale, -this.pos.y * this.scale);
		sketch.rotate(this.rotate);
		sketch.translate(sketch.width * 0.5, sketch.height * 0.5);
		sketch.scale(this.scale);
		const bound = animation.getBoundary();
		const convert = this.worldToScreen(sketch, animation.pos);
		// debugger;

		const first = convert.x + (bound.width * this.scale) / 2 >= 0;
		const second = convert.x - (bound.width * this.scale) / 2 <= sketch.width;
		const third = convert.y + (bound.height * this.scale) / 2 >= 0;
		const forth = convert.y - (bound.height * this.scale) / 2 <= sketch.height;
		if (
			first && // r1 right edge past r2 left
			second && // r1 left edge past r2 right
			third && // r1 top edge past r2 bottom
			forth // r1 bottom edge past r2 top
		) {
			sketch.smooth();
			animation.update();
			animation.draw(sketch);
		}
	}

	shake(noise) {
		if (this.isShaking) return;
		let cX = this.pos.x; // current X
		let cY = this.pos.y; // current Y
		// let random = [-1, 1][Random(0, 1, true)];
		this.pos.x = cX + random(-noise, noise);
		this.pos.y = cY + random(-noise, noise);
	}

	// Chuyển đổi vị trí thực của vật thể (theo hệ toạ độ của mapgame) về vị trí trên màn hình (theo hệ toạ độ màn hình)
	worldToScreen(sketch, worldPos) {
		return {
			x: (worldPos.x - this.pos.x) * this.scale + sketch.width * 0.5,
			y: (worldPos.y - this.pos.y) * this.scale + sketch.height * 0.5
		};
	}

	// Ngược lại của worldToScreen()
	screenToWorld(sketch, screenPos) {
		return {
			x: (screenPos.x - sketch.width * 0.5) / this.scale + this.pos.x,
			y: (screenPos.y - sketch.height * 0.5) / this.scale + this.pos.y
		};
	}
}
