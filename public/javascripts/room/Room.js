import GlobalAssets, { loadAssets } from "../asset.js"
import Manager from "/manager/Manager.js";
import Tag from "/enums/Tag.js"
import * as Sprites from "/animation/sprite/index.js";
import Camera from "../helper/Camera.js";
import { Normal as NormalWorld } from "/world/index.js";

export default class Room {
	id = globalThis.uniqid()
	timeCreate = Date.now()
	camera = new Camera()
	tick = 0
	world = new NormalWorld()
	loadedAssets = {}

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
			"world": async data => {
				for (let i = 0; i < data.length; i++) {
					const item = data[i]; // it = item
					let sprite = this.world.get(item.id)
					if (!sprite) {
						sprite = this.world[this.world.push(
							new Sprites[item.constructorName]({
								...item,
								world: this
							})
						)]
						if (sprite.id == this.socket.id) {
							this.onSelfJoin(sprite, item);
							this.me = sprite;
						}
					}
					sprite.onUpdate(item);
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
		sketch.background("#133a2b")
		const paths = []
		for (let i = 0; i < this.world.sprites.length; i++) {
			const sprMgr = this.world.sprites[i]
			for (let j = 0; j < sprMgr.length; j++) {
				const sprite = sprMgr[j]
				if (sprite.removed) {
					sprMgr.remove(sprite.id)
					j--
					continue
				}

				if (!this.loadedAssets[sprite.id]) {
					const tmp = sprite.assets
					const tmp2 = loadAssets(sketch, sprite.assets)
					sprite.assets = {}
					for (let l = 0; l < tmp.length; l++) {
						sprite.assets[tmp[l]] = tmp2[l]
					}
					this.loadedAssets[sprite.id] = true
				} else {
					sketch.push()
					this.camera.update(sketch, sprite)
					sketch.pop()
				}
			}
		}
		this.tick++
	}
}
