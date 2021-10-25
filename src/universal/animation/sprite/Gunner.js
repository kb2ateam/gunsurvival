import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Gunner extends Sprite {
	assets = ["terrorist.png", "Gunner.png"]
	died = false
	isMaster = false
	QTRadius = 40

	constructor(config = {}) {
		config = Object.assign(
			{
				tag: Tag.GUNNER,
				name: "Gunner#" + config.id,
				infinite: true,
				speedRotate: 0.3
			},
			config
		);
		super(config)
		const {name = "Unknown Player"} = config
		this.name = name
	}

	get rigidBody() {
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 40)
	}

	update() {
		super.update();
	}

	draw(sketch) {
		super.draw(sketch)

		this.isMaster = this.id == sketch.socketID
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

		const img = this.assets["terrorist.png"];
		sketch.rotate(this.angle);
		sketch.image(img, 0, 0, 80, 80);
	}

	onUpdate({angle, pos, tick} = {}) {
		this.frameCount = tick;
		!this.isMaster && this.rotateTo(angle);
		this.moveTo(pos);
	}
}
