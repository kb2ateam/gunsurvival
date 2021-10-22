import World from "./World.js"
import * as Sprites from "../animation/sprite/index.js"

export default class Normal extends World {
	constructor(options) {
		super({
			QTSetting: {
			},
			...options
		})
		for (let i = -2000; i < 2000; i += Math.random() * 50 + 300) {
			for (let j = -2000; j < 2000; j += Math.random() * 50 + 300) {
				this.add(
					new Sprites.Rock({
						world: this,
						pos: {
							x: i,
							y: j
						}
					})
				)
			}
		}
	}

	get plainData() {
		const out = []
		for (let i = 0; i < this.sprites.length; i++) {
			out.push(this.sprites[i].map(sprite => sprite.plainData))
		}
		return out
	}
}
