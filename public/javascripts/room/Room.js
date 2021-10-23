import Manager from "manager/Manager.js";
import Tag from "enums/Tag.js"
import * as Animation from "animations/index.js";
import Camera from "../helpers/Camera.js";
import { Normal as NormalWorld } from "/world/index.js";

export default class Room {
	id = globalThis.uniqid()
	timeCreate = Date.now()
	camera = new Camera()
	tick = 0
	world = new NormalWorld()

	constructor({
		socket,
		master,
		description = "New Game!",
		maxPlayer = 1,
		password = ""
	} = {}) {
		this.socket = socket;
		this.master = master;
		this.description = description;
		this.maxPlayer = maxPlayer;
		this.password = password;
		this.socketIDs = [master];
		this.onMessageHandlers = {
			"room-join": async socketID => await this.onJoin(socketID),
			"room-leave": async socketID => await this.onLeave(socketID),
			"room-dispose": async reason => await this.onDispose(reason),
			world: async data => {
				for (let i = 0; i < data.length; i++) {
					const it = data[i];
					let sprite = this.find({ id: it.id });
					if (!sprite) {
						sprite = this.add(
							new Animation.Sprite[it.className]({
								...it,
								world: this
							}), {
								id: it.id
							}
						);
						sprite.onCreate();
						if (sprite.id == this.socket.id) {
							this.onSelfJoin(sprite, it);
							this.me = sprite;
						}
					}
					sprite.onUpdate(it);
				}
			}
		};
		this.onCreate();
	}

	get metadata() {
		return {
			id: this.id,
			master: this.master,
			description: this.description,
			maxPlayer: this.maxPlayer,
			playing: this.world.getSpritesByTag(Tag.GUNNER).map(x => x.id),
			timeCreate: this.timeCreate
		};
	}

	onMessage(eventName, cb) {
		this.onMessageHandlers[eventName] = cb;
		// returns a method to unbind the callback
		return () => delete this.onMessageHandlers[eventName];
	}

	async onCreate() {}

	async onJoin(socket) {}

	async onSelfJoin(me, options) {
		this.camera.follow(me);
		this.interval_rotate = setInterval(() => {
			this.socket.emit("rotate", me.angle);
		}, 1000 / 50);
	}

	async onLeave(socket) {}

	async onDispose(reason) {
		clearInterval(this.interval_rotate);
		this.deleted = true;
	}

	update(sketch) {
		this.world.nextTick()
		this.updateSketch(sketch)
	}

	updateSketch(sketch) {
		sketch.background("#133a2b")
		for (let i = 0; i < this.world.sprites.length; i++) {
			const sprMgr = this.world.sprites[i]
			for (let j = 0; j < sprMgr.length; j++) {
				const sprite = sprMgr[i]
				if (sprite.removed) {
					sprMgr.remove(sprite.id)
					j--
				}
				sketch.push()
				this.camera.update(sketch, sprite)
				sketch.pop()
			}
		}
		this.tick++
	}
}
