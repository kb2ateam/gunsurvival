import SAT from "../../libs/SAT.js"
import Animation from "../Animation.js";

export default class Sprite extends Animation {
	constructor(options = {}) {
		super({...{
			name: "Unknown Sprite"
		}, ...options})
		const {
			assets = [],
			tag = 0,
			vel = {x: 0, y: 0},
			friction = 0.9
		} = options
		this.assets = assets
		this.tag = tag
		this.vel = new SAT.Vector(vel.x, vel.y)
		this.friction = friction
		this.onCreate()
	}

	update() {
		super.update()
		this.targetPos.add(this.vel)
		this.vel.x *= this.friction
		this.vel.y *= this.friction
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
