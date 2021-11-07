import ServerConfig from "/configs/Server.js"
import Manager from "/manager/Manager.js"
import GlobalAssets, { loadAssets } from "./asset.js"

const p5_functions = [
	"mouseClicked",
	"mousePressed",
	"mouseReleased",
	"mouseMoved",
	"mouseDragged",
	"doubleClicked",
	"mouseWheel",
	"keyPressed",
	"keyReleased",
	"keyTyped",
	"touchStarted",
	"touchMoved",
	"touchEnded",
	"deviceMoved",
	"deviceTurned",
	"deviceShaken"
];

export default class Renderer extends Manager {
	currentIndex = -1
	interval = null

	switchTo(indexOrId) {
		const index = indexOrId
		if (Number.isInteger(index) && index >= 0 && index < this.length) {
			this.currentIndex = index;
			this[index]._executedSetup = false;
		} else {
			const id = indexOrId
			const room = this.get(id)
			if (!room) return
			this.currentIndex = this.indexOf(room)
			room._executedSetup = false
		}
	}

	inject(sketch) {
		const getFitSize = () => {
			let width, height;
			const diff1 = window.innerWidth - ServerConfig.RESOLUTION.WIDTH;
			const diff2 = window.innerHeight - ServerConfig.RESOLUTION.HEIGHT;
			if (diff1 < diff2) {
				width = window.innerWidth;
				height =
					ServerConfig.RESOLUTION.HEIGHT *
					(width / ServerConfig.RESOLUTION.WIDTH);
			} else {
				height = window.innerHeight;
				width =
					ServerConfig.RESOLUTION.WIDTH *
					(height / ServerConfig.RESOLUTION.HEIGHT);
			}
			return { width, height };
		};

		sketch.windowResized = () => {
			const resolution = getFitSize();
			const cur = this[this.currentIndex];
			sketch.resizeCanvas(resolution.width, resolution.height);
			cur.camera.scaleTo(sketch.width / ServerConfig.RESOLUTION.WIDTH);
		};

		sketch.preload = () => {};

		sketch.setup = () => {
			const resolution = getFitSize();
			const canv = sketch.createCanvas(resolution.width, resolution.height);
			const cur = this[this.currentIndex];
			cur.camera.scaleTo(sketch.width / ServerConfig.RESOLUTION.WIDTH);
			canv.parent("game-wrap");
			sketch.imageMode(sketch.CENTER);
		};

		sketch.draw = () => {
			sketch.push();

			const cur = this[this.currentIndex];
			if (!cur._executedSetup) {
				cur.setup && cur.setup(sketch);
				cur._executedSetup = true;
			}
			cur.update && cur.update(sketch);

			sketch.pop();
		};

		for (let i = 0; i < p5_functions.length; i++) {
			const func_name = p5_functions[i]
			sketch[func_name] = (...args) => {
				this[this.currentIndex][func_name] &&
					this[this.currentIndex][func_name](sketch, ...args);
			};
		}
	}
}
