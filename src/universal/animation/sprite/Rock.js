import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Rock extends Sprite {
	assets = ["Rock.png"]

	constructor(config = {}) {
		config = Object.assign(
			{
				tag: Tag.ROCK,
				infinite: true
			},
			config
		);
		super(config);
	}

	get rigidBody() {
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 95)
	}

	update() {
		super.update();
	}

	draw(sketch) {
		super.draw(sketch)
		sketch.translate(this.pos.x, this.pos.y);
		sketch.image(this.assets["Rock.png"], 0, 0);
	}

	onUpdate({pos} = {}) {
		this.moveTo(pos);
	}

	getBoundary() {
		return {
			width: this.assets["Rock.png"].width,
			height: this.assets["Rock.png"].height
		};
	}
}
