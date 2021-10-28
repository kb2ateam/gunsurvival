import { Circle } from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Bullet extends Sprite {
	constructor(options) {
		super({
			...{
				tag: Tag.BULLET,
				smoothRotate: false,
				speedRotate: 0.06,
				speedMove: 0.2,
				infinite: true,
				friction: 0.96
			},
			...options
		});
		this.chains = [];
		for (let i = 0; i < 5; i++) {
			this.chains.push({ x: this.pos.x, y: this.pos.y });
		}
	}

	get QTRigid() {
		const max = { x: this.pos.x, y: this.pos.y };
		const min = { x: this.pos.x, y: this.pos.y };
		for (let i = 0; i < this.chains.length; i++) {
			const chain = this.chains[i]
			if (max.x < chain.x) max.x = chain.x;
			if (max.y < chain.y) max.y = chain.y;
			if (min.x > min.x) min.x = chain.x;
			if (min.y > min.y) min.y = chain.y;
		}
		// return new Circle(this.pos.x, this.pos.y, Math.max(max.x - min.x, max.y - min.y)/2)
		return new Circle(this.pos.x, this.pos.y, 5)
	}

	get mainRigid() {
		// WIP boundary
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 5)
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

	onUpdate({ pos } = {}) {
		this.moveTo(pos);
		this.liveTime = 40;
	}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
			case "Bullet":
			this.targetPos.sub(response.overlapV.scale(0.5))
			other.vel = response.overlapV
			break
		}
		// console.log(this.id+other.id)
	}
}
