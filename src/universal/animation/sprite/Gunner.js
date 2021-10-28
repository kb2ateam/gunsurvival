import { Circle } from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";
import Bullet from "./Bullet.js"

export default class Gunner extends Sprite {
	moving = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	died = false
	speed = 4

	constructor(options = {}) {
		super({ ...{
				tag: Tag.GUNNER,
				assets: ["terrorist.png", "Gunner.png"],
				infinite: true,
				speedRotate: 0.3
			},
			...options
		})
		const {
			name = "Gunner#" + options.id,
			isMaster = false
		} = options
		this.name = name
		this.isMaster = isMaster
	}

	get QTRigid() {
		return new Circle(this.pos.x, this.pos.y, 40)
	}

	get mainRigid() {
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 40)
	}

	shoot() {
		this.shootInterval = setInterval(() => {
			this.world.add(new Bullet({
				world: this.world,
				vel: {
					x: Math.cos(this.angle) * 40,
					y: Math.sin(this.angle) * 40
				},
				pos: {
					x: this.pos.x + Math.cos(this.angle) * 50,
					y: this.pos.y + Math.sin(this.angle) * 50
				}
			}))
		}, 50)
	}

	stopShoot() {
		clearInterval(this.shootInterval)
	}

	getSpeedV() {
		return new SAT.Vector(
			this.moving.left ? -1 : this.moving.right ? 1 : 0,
			this.moving.up ? -1 : this.moving.down ? 1 : 0
		).scale(
			(1 / Math.sqrt(2)) * this.speed * (64 / 64)
		);
	}

	update() {
		super.update();
		this.targetPos.add(this.getSpeedV())
	}

	draw(sketch) {
		super.draw(sketch)
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

	onUpdate({ angle, pos, tick } = {}) {
		this.frameCount = tick;
		!this.isMaster && this.rotateTo(angle);
		this.moveTo(pos);
	}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
			case "Gunner":
			this.targetPos.sub(response.overlapV.scale(0.5))
			break
			case "Bullet":
			this.targetPos.sub(response.overlapV.scale(0.5))
			other.vel = response.overlapV
			break
		}
		// console.log(this.id+other.id)
	}
}
