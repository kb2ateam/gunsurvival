import Sprite from "./Sprite.js";
import {images} from "../../globals/asset.global.js";

export default class Player extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Gunner#" + config.id,
				infinite: true,
				speedRotate: 0.3
			},
			config
		);
		super(config);
		const {name = "Unknown Player"} = config;
		this.dead = false;
		this.isMaster = this.id == this.world.socket.id;
	}

	update() {
		super.update();
	}

	draw(sketch) {
		if (this.isMaster)
			this.rotateTo(
				sketch.atan2(
					sketch.mouseY - sketch.height / 2,
					sketch.mouseX - sketch.width / 2
				)
			);
		sketch.translate(this.pos.x, this.pos.y);
		sketch.textAlign(sketch.CENTER, sketch.CENTER);
		sketch.textSize(18); // draw name
		sketch.stroke("white");
		sketch.strokeWeight(1);
		sketch.fill("white");
		sketch.text(this.name, 0, -60);

		const img = images["terrorist.png"];
		sketch.rotate(this.angle);
		sketch.image(img, 0, 0, 80, 80);
	}

	onUpdate({angle, pos, tick} = {}) {
		// debugger;
		this.frameCount = tick;
		!this.isMaster && this.rotateTo(angle);
		this.moveTo(pos);
	}

	getBoundary() {
		return {
			width: images["Gunner.png"].width,
			height: images["Gunner.png"].height
		};
	}
}
