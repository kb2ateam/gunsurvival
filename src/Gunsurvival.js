import * as Room from "./room/index.js"
import RoomManager from "./universal/manager/RoomManager.js"
import ServerConfig from "./universal/configs/Server.js"
import * as logger from "./helpers/console.js"
import * as Sprites from "./universal/animation/sprite/index.js"

export default class GameServer {
	rooms = new RoomManager()
	tps = 0
	timePassed = 0
	diff = 1000 / ServerConfig.TICKRATE
	totalSent = 0

	constructor(io) {
		this.io = io

		io.on("connection", async socket => {
			socket.onAny((eventName, ...args) => {
				socket.adapter.rooms.forEach((key, roomID) => {
					if (roomID == socket.id || // vì room id theo socket.id là sảnh chờ (built-in socket.io)
						!this.rooms.get(roomID)) return
					const cb = this.rooms.get(roomID).eventHandlers[eventName]
					try {
						if (cb) cb(socket, ...args)
					} catch (e) {
						logger.error(e.stack)
					}
				})
			})

			socket.on("lobby-join", async () => {
				logger.info(`Connected: ${socket.id} [ ${this.onlines} ]`)
				// const lobbyID = "lobby" + socket.id
				const lobbyID = "lobby"

				if (!this.rooms.get(lobbyID)) {
					this.rooms.push(new Room.Lobby({
						gameServer: this,
						id: lobbyID,
						master: socket.id,
						description: "My lobby",
						maxPlayer: 5
					}))
					const myLobby = this.rooms.get(lobbyID)
					for (let i = -2000; i < 2000; i += Math.random() * 50 + 300) {
						for (let j = -2000; j < 2000; j += Math.random() * 50 + 300) {
							myLobby.world.add(
								new Sprites.Rock({
									world: this,
									pos: {
										x: i,
										y: j
									}
								})
							)
						}
					}
				}
				const myLobby = this.rooms.get(lobbyID)

				try {
					await myLobby.requestJoin(socket)
					socket.emit("lobby-join", ServerConfig)
				} catch (e) {
					socket.emit("error", "Lỗi!")
					logger.error(e.stack)
				}
			})

			socket.on("disconnect", () => {
				logger.info(
					`Disconnected: ${socket.id} [ ${this.onlines} ]`
				)
				for (let i = 0; i < this.rooms.length; i++) {
					const room = this.rooms[i]
					room.onLeave(socket, false) // bị rời ko chủ động (rớt mạng hoặc tắt tab)
					room.onAnyLeave(socket)
				}
			})

			socket.on("_ping", clientTime => socket.emit("pong", Number(clientTime)))
		})
	}

	get onlines() {
		return this.io.sockets.sockets.size
	}

	emit(eventName, ...args) {
		this.io.emit(eventName, ...args)
	}

	async createRoom(socket, options) {
		let mode
		for (const key in Room) {
			if (key.toLowerCase() == options.mode) {
				mode = key
				break
			}
		}
		if (!mode) throw new Error("Lỗi")
		this.rooms.push(new Room[mode]({
				gameServer: this,
				master: socket.id
			},
			...options
		))
	}

	start() {
		this.loop()
	}

	stop() {
		// clearInterval(this.balanceTPSInterval)
	}

	loop() {
		this.performance = this.update()
		this.timePassed += this.performance + this.diff
		this.tick++
		if (this.timePassed > 1000) {
			const div = Math.abs(this.tick - this.tps)
			if (this.tick > this.tps && div > this.tps * 0.1) {
				this.tps += Math.round(div / 4)
			}
			if (this.tick < this.tps && div > this.tps * 0.05) {
				this.tps -= Math.round(div / 2)
			}
			let count = 0
			if (this.rooms[0]) {
				 for (let i = 0; i < this.rooms.length; i++) {
				 	for (let j = 0; j < this.rooms[i].world.sprites.length; j++) {
				 		count += this.rooms[i].world.sprites[j].length
				 	}
				 }
			}
			console.log("sprites: " + count, "tickrate: " + this.tick, "cycle: " + this.performance.toFixed(2) + "ms", "avg sent: ", (this.totalSent / 1024 / this.tick).toFixed(2) + "kB")
			this.timePassed -= 1000
			this.tick = 0
		}
		setTimeout(() => this.loop(), this.diff)
	}

	update() {
		const start = performance.now()
		for (let i = 0; i < this.rooms.length; i++) {
			const room = this.rooms[i]
			if (room.isRemoved) {
				this.rooms.remove(room.id)
					--i
				continue
			}
			if (!room.isPaused) {
				room.world.nextTick()
				room.sendUpdates()
			}
		}
		return performance.now() - start
	}
}


function roughSizeOfObject(object) {
	var objectList = [];
	var stack = [object];
	var bytes = 0;

	while (stack.length) {
		var value = stack.pop();

		if (typeof value === 'boolean') {
			bytes += 4;
		} else if (typeof value === 'string') {
			bytes += value.length * 2;
		} else if (typeof value === 'number') {
			bytes += 8;
		} else if (
			typeof value === 'object' &&
			objectList.indexOf(value) === -1
		) {
			objectList.push(value);

			for (var i in value) {
				stack.push(value[i]);
			}
		}
	}
	return bytes;
}
