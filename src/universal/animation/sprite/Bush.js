import Sprite from "./Sprite.js";
import {images} from "../../globals/asset.global.js";

export default class Bush extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Bush",
				infinite: true
			},
			config
		);
		super(config);
		const {hideAmount = 0} = config;
		this.hideAmount = hideAmount;
		this.toggleShake = -1;
	}

	update() {
		super.update();
		if (this.hideAmount < 0) this.hideAmount = 0;
		if (this.hideAmount > 0) {
			if (this.toggleShake == -1) this.rotateTo(this.targetAngle - 1);
			if (this.toggleShake == 1) this.rotateTo(this.targetAngle + 1);
			if (this.angle <= this._angle - 0.12) this.toggleShake = 1;
			if (this.angle >= this._angle + 0.12) this.toggleShake = -1;
		} else {
			this.rotateTo(this._angle);
			this.speedRotate = 0.0017;
		}
	}

	render(sketch) {
		sketch.translate(this.pos.x, this.pos.y);
		sketch.image(images["Bush.png"], 0, 0);
	}

	onUpdate({pos, hideAmount, tick} = {}) {
		this.moveTo(pos);
		this.hideAmount = hideAmount;
	}

	getBoundary() {
		return {
			width: images["Bush.png"].width,
			height: images["Bush.png"].height
		};
	}
}
