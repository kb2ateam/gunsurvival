import Manager from "./helpers/Manager.js";
import {loadAssets} from "./globals/asset.global.js";

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
	constructor() {
		super();
		this.currentIndex = -1;
		this.interval;
		this.tps = 30;
		this.tick = 0;
	}

	switchTo(index) {
		if (this.items[index]) {
			this.currentIndex = index;
			this.items[index]._executedSetup = false;
		}
	}

	inject(sketch) {
		const getFitSize = () => {
			let width, height;
			const diff1 = window.innerWidth - SERVER_CONFIG.RESOLUTION.WIDTH;
			const diff2 = window.innerHeight - SERVER_CONFIG.RESOLUTION.HEIGHT;
			if (diff1 < diff2) {
				width = window.innerWidth;
				height =
					SERVER_CONFIG.RESOLUTION.HEIGHT *
					(width / SERVER_CONFIG.RESOLUTION.WIDTH);
			} else {
				height = window.innerHeight;
				width =
					SERVER_CONFIG.RESOLUTION.WIDTH *
					(height / SERVER_CONFIG.RESOLUTION.HEIGHT);
			}
			return {width, height};
		};

		sketch.windowResized = () => {
			const resolution = getFitSize();
			const cur = this.items[this.currentIndex];
			sketch.resizeCanvas(resolution.width, resolution.height);
			cur.camera.scaleTo(sketch.width / SERVER_CONFIG.RESOLUTION.WIDTH);
		};

		sketch.preload = () => {
			// Sweetalert2.fire({
			// 	title: "bruh",
			// 	text: "loading"
			// });
			loadAssets({
				sketch,
				onProgress: () => {}
			});
		};

		sketch.setup = () => {
			const resolution = getFitSize();
			const canv = sketch.createCanvas(resolution.width, resolution.height);
			const cur = this.items[this.currentIndex];
			cur.camera.scaleTo(sketch.width / SERVER_CONFIG.RESOLUTION.WIDTH);
			canv.parent("game-wrap");
			sketch.imageMode(sketch.CENTER);
		};

		sketch.draw = () => {
			sketch.push();

			const cur = this.items[this.currentIndex];
			if (!cur._executedSetup) {
				cur.setup && cur.setup(sketch);
				cur._executedSetup = true;
			}
			cur.update && cur.update(sketch);

			sketch.pop();
			this.tick++;
		};

		this.interval = setInterval(() => {
			const div = Math.abs(this.tick - this.tps);
			if (this.tick - this.tps > this.tps / 10) this.tps += Math.round(div / 2);
			if (this.tps - this.tick > this.tps / 10) this.tps -= Math.round(div / 2);
			this.tick = 0;
			// console.log(this.tps);
		}, 1000);

		for (const func_name of p5_functions) {
			sketch[func_name] = (...args) => {
				this.items[this.currentIndex][func_name] &&
					this.items[this.currentIndex][func_name](sketch, ...args);
			};
		}
	}
}
