import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Bullet extends Sprite {
	constructor(config = {}) {
		config = Object.assign(
			{
				tag: Tag.BULLET,
				smoothRotate: false,
				speedRotate: 0.06,
				speedMove: 0.2,
				liveTime: 40
			},
			config
		);
		super(config);
		this.chains = [];
		for (let i = 0; i < 5; i++) {
			this.chains.push({x: this.pos.x, y: this.pos.y});
		}
	}

	get rigidBody() {
		// WIP boundary
		const max = {x: this.pos.x, y: this.pos.y};
		const min = {x: this.pos.x, y: this.pos.y};
		for (let i = 0; i < this.chains.length; i++) {
			const chain = this.chains[i]
			if (max.x < chain.x) max.x = chain.x;
			if (max.y < chain.y) max.y = chain.y;
			if (min.x > min.x) min.x = chain.x;
			if (min.y > min.y) min.y = chain.y;
		}
		return {
			width: max.x - min.x,
			height: max.y - min.y
		}
	}

	update() {
		super.update()
		for (let i = this.chains.length - 1; i > 0; i--) {
			this.chains[i].x = this.chains[i - 1].x
			this.chains[i].y = this.chains[i - 1].y
		}
		this.chains[0].x = this.pos.x
		this.chains[0].y = this.pos.y
	}

	draw(sketch) {
		super.draw(sketch)
		sketch.strokeWeight(6);
		sketch.stroke("white");
		for (let i = 0; i < this.chains.length - 1; i++) {
			sketch.line(
				this.chains[i].x,
				this.chains[i].y,
				this.chains[i + 1].x,
				this.chains[i + 1].y
			);
		}
	}

	onUpdate({pos} = {}) {
		this.moveTo(pos);
		this.liveTime = 40;
	}
}
