import Manager from "../helpers/Manager.js";
import * as Animation from "../animations/index.js";
import Camera from "../helpers/Camera.js";

export default class World extends Manager {
	constructor({
		socket,
		id,
		master,
		description = "New Game!",
		maxPlayer = 1,
		password = "",
		timeCreate = Date.now()
	} = {}) {
		super();
		this.socket = socket;
		this.id = id;
		this.master = master;
		this.description = description;
		this.maxPlayer = maxPlayer;
		this.password = password;
		this.timeCreate = timeCreate;
		this.socketIDs = [master];
		this.onMessageHandlers = {
			"room-join": async socketID => await this.onJoin(socketID),
			"room-leave": async socketID => await this.onLeave(socketID),
			"room-dispose": async reason => await this.onDispose(reason),
			world: async data => {
				for (let i = 0; i < data.length; i++) {
					const it = data[i];
					let sprite = this.find({id: it.id});
					if (!sprite) {
						sprite = this.add(
							new Animation.Sprite[it.className]({
								...it,
								world: this
							}),
							{
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
		this.tick = 0;
		this.camera = new Camera();
		this.onCreate();
	}

	getMetadata() {
		return {
			id: this.id,
			master: this.master,
			description: this.description,
			maxPlayer: this.maxPlayer,
			playing: this.items.map(x => x.id),
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
		sketch.background("#133a2b");
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].removed) {
				this.items.splice(i--, 1);
				continue;
			}
			sketch.push();
			this.camera.update(sketch, this.items[i]);
			sketch.pop();
		}
		this.tick++;
	}
}
