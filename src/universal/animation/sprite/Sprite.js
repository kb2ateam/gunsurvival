import Animation from "../Animation.js";

export default class Sprite extends Animation {
	constructor(options = {}) {
		super({...{
			name: "Unknown Sprite"
		}, ...options})
		const {
			assets = [],
			tag = 0
		} = options
		this.assets = assets
		this.tag = tag
		// this.rigidBody = {}
		// this.QTRadius = 40
		this.onCreate()
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
