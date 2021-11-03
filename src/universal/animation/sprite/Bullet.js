import { Circle } from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Bullet extends Sprite {
	chains = []
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
		const { ownerID } = options
		this.ownerID = ownerID
		this.owner = this.world.find(ownerID)
		for (let i = 0; i < 2; i++) {
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

	get plainData() {
		return {
			...super.plainData,
			ownerID: this.ownerID
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

	moveTo(pos) {
		super.moveTo(pos)
		this.chains[0].x = pos.x
		this.chains[0].y = pos.y
	}

	onUpdate({ pos, vel } = {}) {
		if (distance(pos, this.targetPos) > 10) {
			this.moveTo(pos);
			this.vel.x = vel.x
			this.vel.y = vel.y
		}

		// this.liveTime = 40;
	}

	onCollisionEnter(other, response) {
		switch (other.constructor.name) {
		case "Bullet":
			{
				const len = this.vel.len()
				this.vel.x = this.vel.x = response.overlapV.x
				this.vel.y = response.overlapV.y
				this.vel.scale(len / response.overlapV.len())
				this.vel.scale(.5)
				break
			}
		}
		// console.log(this.id+other.id)
	}
}


function distance(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}
