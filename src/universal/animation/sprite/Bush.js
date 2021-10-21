import Sprite from "./Sprite.js";

export default class Bush extends Sprite {
	assets = ["Bush.png"]
	hideAmount = 0

	constructor(config = {}) {
		config = Object.assign(
			{
				infinite: true
			},
			config
		);
		super(config);
		const {hideAmount = 0} = config;
		this.toggleShake = -1;
	}

	update() {
		super.update()
	}

	draw(sketch) {
		super.draw(sketch)
		this.targetAngle = Math.PI/6 * sin(sketch.frameCount)
		sketch.image(this.assets["Bush.png"], 0, 0)
	}

	onUpdate({pos, hideAmount} = {}) {
		this.moveTo(pos);
		this.hideAmount = hideAmount;
	}

	getBoundary() {
		return {
			width: this.assets["Bush.png"].width,
			height: this.assets["Bush.png"].height
		};
	}
}
