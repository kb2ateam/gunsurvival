import Animation from "../Animation.js";

export default class Sprite extends Animation {
	viewDistance = 80 * 2

	constructor(config = {}) {
		config = Object.assign(
			{
				name: "Unknown Sprite"
			},
			config
		);
		super(config);
		const {tag} = config
		this.tag = tag || 0
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
}
