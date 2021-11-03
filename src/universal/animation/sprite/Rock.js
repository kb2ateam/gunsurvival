import { Circle } from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Rock extends Sprite {
	constructor(options = {}) {
		super({ ...{
				tag: Tag.ROCK,
				assets: ["Rock.png"],
				infinite: true
			},
			...options
		})
	}

	get QTRigid() {
		return new Circle(this.pos.x, this.pos.y, 95)
	}

	get mainRigid() {
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 95)
	}

	update() {
		super.update();
	}

	draw(sketch) {
		super.draw(sketch)
		sketch.translate(this.pos.x, this.pos.y);
		sketch.image(this.assets["Rock.png"], 0, 0);
	}

	onUpdate({ pos } = {}) {
		this.moveTo(pos);
	}

	onCollisionEnter(other, response) {
		switch (other.constructor.name) {
		case "Bullet":
			{
				const k = angleCoefficient(other.vel)
				const x0 = other.targetPos.x
				const y0 = other.targetPos.y
				const roots = quadraticRoots(...getQuadratic([k, x0, y0], [this.pos.x, this.pos.y, 95]))
				const points = roots.map(root => [root, k * (root - x0) + y0])
				const distances = points.map(point => distance(other.owner.pos.x, other.owner.pos.y, point[0], point[1]))
				const final = distances[0] < distances[1] ? points[0] : points[1]

				if (roots.length == 2) {
					other.targetPos.x = final[0]
					other.targetPos.y = final[1]
				}
				break
			}
		}
	}

	onCollisionStay(other, response) {
		switch (other.constructor.name) {
		case "Gunner":
			other.targetPos.add(response.overlapV)
			break
		case "Bullet":
			{
				const len = other.vel.len()
				other.vel.x = response.overlapV.x
				other.vel.y = response.overlapV.y
				other.vel.scale(len / response.overlapV.len())
				other.vel.scale(.5)
				break
			}
		}
		// console.log(this.id+other.id)
	}
}

function distance(x0, y0, x1, y1) {
	return Math.sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2)
}

function getQuadratic(linear, circle) {
	const k = linear[0]
	const x0 = linear[1]
	const y0 = linear[2]

	const a = circle[0]
	const b = circle[1]
	const c = circle[2]
	return [
		1 + k ** 2,
		-2 * a - 2 * k ** 2 * x0 + 2 * k * y0 - 2 * b * k,
		a ** 2 + k ** 2 * x0 ** 2 - 2 * k * x0 * y0 + y0 ** 2 - 2 * b * (-k * x0 + y0) + b ** 2 - c ** 2
	]
}

function angleCoefficient(vector) {
	return vector.y / vector.x
}

function quadraticRoots(a, b, c) {
	const delta = b ** 2 - 4 * a * c
	if (delta > 0)
		return [
			(-b - Math.sqrt(delta)) / (2 * a),
			(-b + Math.sqrt(delta)) / (2 * a)
		]
	if (delta == 0)
		return [-b / (2 * a)]
	return []
}
