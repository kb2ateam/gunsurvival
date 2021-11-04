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
	baseSpeed = 6
	speed = 6
	blood = 100

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

	get plainData() {
		return {
			...super.plainData,
			blood: this.blood
		}
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
		}, 100)
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

	onUpdate({ angle, pos, blood, tick } = {}) {
		this.frameCount = tick;
		if (!this.isMaster) {
			this.rotateTo(angle);
			this.moveTo(pos);
		} else {
			if (distance(pos, this.pos) > 50)
				this.moveTo(pos);
		}
		if (blood == 100) {
			this.name = `${Math.floor(blood)}`
		} else
		if (this.blood != blood) {
			this.name = `${Math.floor(blood)} [-${Math.floor(this.blood - blood)}]`
			this.blood = blood
		}
		if (blood <= 0) {
			this.destroy()
		}
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
			this.targetPos.sub(response.overlapV.scale(0.5))
			break
		case "Bush":
			other.hideAmount++
			this.speed *= 0.5
			this.visible = false
			break
		case "Bullet":
			{
				if (other.ownerID == this.id) break
				this.speed = 2
				this.slowDown = setTimeout(() => {
					this.speed = this.baseSpeed
				}, 1000)
				this.blood -= other.vel.len() / 2
				if (this.blood <= 0) {
					this.targetPos.x = -600 + Math.random()*1200
					this.targetPos.y = -600 + Math.random()*1200
					this.blood = 100
				}
				other.destroy()
				break
			}
		}
	}

	onCollisionExit(other, response) {
		switch (other.constructor.name) {
		case "Bush":
			other.hideAmount--
			this.speed = this.baseSpeed
			this.visible = true
			break
		}
	}
}

function distance(v1, v2) {
	return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

function lerp(value1, value2, amount) {
	amount = amount < 0 ? 0 : amount
	amount = amount > 1 ? 1 : amount
	return value1 + (value2 - value1) * amount
}
