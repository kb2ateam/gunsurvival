import { Quadtree, Point, Rectangle, Circle } from "../libs/Quadtree.js"

// This is a Manager class, but not extend from ./Manager.js
export default class QuadtreeManager {
	lrgstRange = 0

	constructor({ boundary = [0, 0, 0, 0], split = 4} = {}) {
		this.boundary = new Rectangle(...boundary)
		this.split = split
		this.reset()
	}

	reset() {
		this.quadtree = new Quadtree(this.boundary, this.split)
	}

	insert(sprite) {
		this.quadtree.insert(new Point(sprite.pos.x, sprite.pos.y, sprite))
		if (this.lrgstRange < sprite.QTRange) this.lrgstRange = sprite.QTRange
	}

	query(sprite) {
		const {x, y, viewDistance} = sprite.pos
		return this.quadtree.query(new Circle(x, y, viewDistance))
	}
}
