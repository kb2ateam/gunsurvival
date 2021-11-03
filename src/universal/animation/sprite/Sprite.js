import SAT from "../../libs/SAT.js"
import Animation from "../Animation.js";

export default class Sprite extends Animation {
	constructor(options = {}) {
		super({
			name: "Unknown Sprite",
			...options
		})
		const {
			assets = [],
			tag = 0,
			vel = {x: 0, y: 0},
			friction = 0.9
		} = options
		this.assets = assets
		this.tag = tag
		this.vel = new SAT.Vector(vel.x, vel.y)
		this.friction = new SAT.Vector(0.5, 0.5)
		this.onCreate()
	}

	get plainData() {
		return {
			...super.plainData,
			vel: this.vel
		}
	}

	update() {
		super.update()
		// console.log(new SAT.Vector(this.vel.x, this.vel.y).scale(this.world.scaleTick))
		// console.log(this.world.scaleTick, this.world.delta)
		// console.log(new SAT.Vector(this.vel.x * this.world.scaleTick, this.vel.y * this.world.scaleTick))
		this.targetPos.add(this.vel.clone().scale(this.world.scaleTick))
		// console.log(this.world.scaleTick)
		this.vel.sub(this.vel.clone().scale(0.06*this.world.scaleTick))
	}

	onCreate() {
		// socket update for on create
	}

	onUpdate() {
		// socket update
	}

	onDestroy() {
		// socket update for on destroy
	}

	onCollisionEnter() {

	}

	onCollisionStay() {

	}

	onCollisionExit() {

	}
}
