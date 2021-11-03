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
	speed = 6

	constructor(options = {}) {
		super({ ...{
				tag: Tag.GUNNER,
				assets: ["amogus-cyan.png", "Gunner.png", "ak47.png"],
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
				ownerID: this.id,
				world: this.world,
				vel: {
					x: Math.cos(this.angle) * 60,
					y: Math.sin(this.angle) * 60
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
			(1 / Math.sqrt(2)) * this.speed
		);
	}

	update() {
		super.update();
		this.vel = this.getSpeedV()
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

		const img = this.assets["amogus-cyan.png"];
		const ak = this.assets["ak47.png"]
		if (Math.cos(this.angle) > 0) {
			sketch.scale(1, 1)
			sketch.image(img, 0, 0, 65, 65 * img.height / img.width);
			sketch.rotate(this.angle)
			sketch.image(ak, 10, 10, 80, 80 * ak.height / ak.width)
		} else {
			sketch.scale(-1, 1)
			sketch.image(img, 0, 0, 65, 65 * img.height / img.width);
			sketch.scale(-1, -1)
			sketch.rotate(-this.angle)
			sketch.image(ak, 10, 10, 80, 80 * ak.height / ak.width)
		}
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
			if (other.ownerID == this.id) break
			this.targetPos.sub(response.overlapV.scale(0.5))
			other.vel = response.overlapV
			break
		}
		// console.log(this.id+other.id)
	}

	onCollisionEnter(other, response) {
		switch (other.constructor.name) {
		case "Gunner":
			// this.targetPos.sub(response.overlapV.scale(0.5))
			console.log(this.id)
			break
		case "Bush":
			other.hideAmount++
			this.baseSpeed = other.speed
			this.speed *= 0.5
			this.visible = false
			break
		case "Bullet":
			{
				if (other.ownerID == this.id) break
				const baseSpeed = 7
				clearTimeout(this.slowDown)
				this.speed = 2
				this.slowDown = setTimeout(() => {
					this.speed = baseSpeed
				}, 1000)
				// this.blood -= other.vel.len() / 2
				break
			}
		}
	}

	onCollisionExit(other, response) {
		switch (other.constructor.name) {
		case "Bush":
			other.hideAmount--
			this.speed = other.baseSpeed || 8
			this.visible = true
			break
		}
		// console.log(this.id+other.id)
	}
}
