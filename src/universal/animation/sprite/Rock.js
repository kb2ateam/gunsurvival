import {Circle} from "../../libs/Quadtree.js"
import SAT from "../../libs/SAT.js"
import Tag from "../../enums/Tag.js"
import Sprite from "./Sprite.js";

export default class Rock extends Sprite {
	constructor(options = {}) {
		super({...{
			tag: Tag.ROCK,
			assets: ["Rock.png"]
		}, ...options})
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

	getBoundary() {
		return {
			width: this.assets["Rock.png"].width,
			height: this.assets["Rock.png"].height
		};
	}
}
