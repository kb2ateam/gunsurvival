import ServerConfig from "../configs/Server.js"
import { Quadtree, Point, Rectangle, Circle } from "../libs/Quadtree.js"

// This is a Manager class, but not extend from ./Manager.js
export default class QuadtreeManager {
	lrgstRadius = ServerConfig.RESOLUTION.WIDTH

	constructor({ boundary = [0, 0, 0, 0], split = 4 } = {}) {
		this.boundary = new Rectangle(...boundary)
		this.split = split
		this.reset()
	}

	reset() {
		this.quadtree = new Quadtree(this.boundary, this.split)
	}

	insert(sprite) {
		const { x, y, r } = sprite.QTRigid
		this.quadtree.insert(new Point(x, y, sprite))
		if (this.lrgstRadius < r) this.lrgstRadius = r
	}

	query(sprite, range) {
		const { x, y, r } = sprite.QTRigid
		if (!range) range = new Circle(x, y, r * 2)
		return this.quadtree.query(range)
	}
}
