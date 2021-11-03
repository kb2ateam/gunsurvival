import { Circle } from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Bush extends Sprite {
	hideAmount = 0

	constructor(options = {}) {
		super({
			...{
				assets: ["Bush.png"],
				tag: Tag.BUSH,
				infinite: true
			},
			...options
		})
	}

	get QTRigid() {
		return new Circle(this.pos.x, this.pos.y, 60)
	}

	get mainRigid() {
		return new SAT.Circle(new SAT.Vector(this.pos.x, this.pos.y), 60)
	}

	// get plainData() {
	// 	return {
	// 		...super.plainData,
	// 		...{
	// 			hideAmount: this.hideAmount
	// 		}
	// 	}
	// }

	update() {
		super.update()
	}

	draw(sketch) {
		super.draw(sketch)
		if (this.hideAmount > 0)
			this.rotateTo(Math.PI/6 * Math.cos(Math.PI/6 * this.tick*.1))
		else
			this.rotateTo(0)
		sketch.translate(this.pos.x, this.pos.y);
		sketch.rotate(this.angle);
		sketch.image(this.assets["Bush.png"], 0, 0)
	}

	onUpdate({pos} = {}) {
		this.moveTo(pos);
	}

	onCollisionEnter(other, response) {
	}

	onCollisionExit(other, response) {
	}
}
