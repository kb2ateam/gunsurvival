import SAT from "sat"
import QuadtreeManager from "../manager/QuadtreeManager.js"
import SpriteManager from "../manager/SpriteManager.js"
import Manager from "../manager/Manager.js"
import TagOdering from "../../configs/TagOrdering.js"

export default class World {
	sprites = []
	QTManager = new QuadtreeManager({
		boundary: [0, 0, 2000, 2000]
	})
	executedOCE = new Manager() // list executed on collision enter

	constructor({
	}) {
	}

	nextTick() {
		this.QTManager.reset();
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				const sprite = this.sprites[i][j];
				if (sprite.removed) {
					this.sprites[i].splice(j--, 1)
					continue;
				}
				sprite.update();
				sprite.tick++;
				this.QTManager.insert(sprite);
			}
		}

		const collided = {}
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				const sprite = this.sprites[i][j];
				const result = this.QTManager.query(sprite);
				if (result.length <= 1) continue;
				for (let k = 0; k < result.length; k++) {
					const other = result[k].userData;
					if (sprite == other) continue;
					const rigid1 = sprite.rigidBody;
					const rigid2 = other.rigidBody;
					const response = new SAT.Response();
					if (
						SAT[`test${rigid1.constructor.name}${rigid2.constructor.name}`](
							rigid1,
							rigid2,
							response
						)
					) {
						collided[sprite.id + other.id] = true
						if (!this.executedOCE.get(sprite.id + other.id)) {
							sprite.onCollisionEnter(other, response)
							this.executedOCE.push({
								id: sprite.id + other.id,
								sprite,
								other
							})
						}
						sprite.onCollisionStay(other, response)
					}
				}
			}
		}

		for (let i = 0; i < this.executedOCE.length; i++) {
			const { id, sprite, other } = this.executedOCE[i]
			if (!collided[id]) {
				sprite.onCollisionExit(other)
				this.executedOCE.remove(id)
				i--
			}
		}
	}

	getSpritesByTag(tag) {
		const index = TagOdering.get(tag)
		return index ? this.sprites[index] : undefined
	}

	add(sprite) {
		const index = TagOdering.get(sprite.tag)
		if (index) {
			this.sprites[index].push(sprite)
		} else {
			this.sprites.push(new SpriteManager([sprite]))
			TagOdering.push(sprite.tag)
		}
	}

	remove(sprite) {
		const sm = this.getSpritesByTag(sprite.tag) // sm = sprite manager
		if (sm) {
			sm.remove(sprite.id)
		}
	}

	find(id) {
		for (let i = 0; i < this.sprites.length; i++) {
			const sprite = this.sprites[i].get(id)
			if (sprite) return sprite
		}
	}

	filter(query, once = false) {
		const out = []
		for (let i = 0; i < this.sprites.length; i++) {
			for (let j = 0; j < this.sprites[i].length; j++) {
				let found = true;
				for (const property in query)
					if (this.sprites[i][j][property] != query[property]) {
						found = false;
						break;
					}
				if (found) {
					if (once) return this.sprites[i][j]
					out.push(this.sprites[i][j])
				}
			}
		}
		return out
	}

	static isTags(item1, item2, comparisonType) {
		// btw is not "By the way" but "Between"
		return (
			comparisonType.includes(item1.tag) || comparisonType.includes(item2.tag)
		)
	}

	sendUpdates(room) { // server-side only

	}
}
