import Sprite from "./Sprite.js";
import {images} from "../../globals/asset.global.js";

export default class Rock extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Rock",
				infinite: true
			},
			config
		);
		super(config);
	}

	update() {
		super.update();
	}

	render(sketch) {
		sketch.translate(this.pos.x, this.pos.y);
		sketch.image(images["Rock.png"], 0, 0);
	}

	onUpdate({pos, hideAmount, tick} = {}) {
		this.moveTo(pos);
	}

	getBoundary() {
		return {
			width: images["Rock.png"].width,
			height: images["Rock.png"].height
		};
	}
}
