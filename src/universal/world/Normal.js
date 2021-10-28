import World from "./World.js"

export default class Normal extends World {
	constructor(options) {
		super({
			...options
		})
	}

	get plainData() {
		const out = []
		for (let i = 0; i < this.sprites.length; i++) {
			out.push(this.sprites[i].map(sprite => sprite.plainData))
		}
		return out
	}
}
