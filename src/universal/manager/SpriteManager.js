import Manager from "./Manager.js"

export default class SpriteManager extends Manager {
	constructor(sprites = []) {
		super(sprites)
	}

	first() {
		return super.first().sprite
	}

	last() {
		return super.last().sprite
	}

	get(id) {
		const sprite = super.get(id)
		if (sprite)
			return sprite.sprite
	}

	push(sprite, index = this.length) {
		super.push({
			id: index,
			sprite
		})
	}
}