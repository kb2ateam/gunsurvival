import Room from "./Room.js"
// import Sprite from "../sprites"
import {Normal as NormalWorld} from "../world/index.js"
import {Rectangle} from "../helpers/Quadtree.js"

export default class Lobby extends Room {
	constructor(options) {
		super(options)
		this.world = new NormalWorld({})
	}

	async onCreate(options) {
		this.onMessage("change-name", (socket, data) => {
			// console.log("bruh2")
		})

		this.onMessage("room-join", async (socket, roomID) => {
			try {
				await this.rooms[roomID].requestJoin(socket)
				socket.leave(socket.data.currentLobby)
			} catch {
				socket.emit("error", "Lỗi!")
			}
		})

		this.onMessage("room-create", async (socket, options) => {
			try {
				await this.gameServer.createRoom(socket, options)
			} catch (e) {
				socket.emit("error", e.message)
			}
		})

		this.onMessage("moving", (socket, moving = {}) => {
			const player = socket.data.player
			if (!player) return
			if (moving.up === true) player.moving.up = true
			if (moving.down === true) player.moving.down = true
			if (moving.left === true) player.moving.left = true
			if (moving.right === true) player.moving.right = true

			if (moving.up === false) player.moving.up = false
			if (moving.down === false) player.moving.down = false
			if (moving.left === false) player.moving.left = false
			if (moving.right === false) player.moving.right = false
		})

		this.onMessage("shoot", (socket, event = []) => {
			const player = socket.data.player
			if (!player) return
			const [isPressing, angle] = event
			if (isPressing === true) player.shoot(angle)

			if (isPressing === false) player.stopShoot(angle)
		})

		this.onMessage("rotate", (socket, angle = 0) => {
			const player = socket.data.player
			if (!player) return
			player.angle = angle
		})
	}

	async onJoin(socket) {
		socket.data.currentLobby = this.id
		const player = new Sprite.Gunner({
			world: this.world,
			id: socket.id
		})
		this.world.add(player)
		socket.data.player = player
		this.start()
	}

	async onLeave(socket, consented) {
		if (!consented && socket.data.player instanceof Sprite.Sprite)
			return this.world.remove(socket.data.player)
		if (
			socket.data.currentLobby &&
			socket.data.currentLobby != "lobby" + socket.id
		) {
			this.remove({id: socket.id})
			await this.rooms["lobby" + socket.id].requestJoin(socket)
		} else {
			throw new Error("Bạn không thể thoát lobby của chính mình!")
		}
		this.world.remove(socket.data.player)
	}

	start() {
		this.updateInterval = setInterval(() => {
			const gunners = this.world.getSpritesByTag("Gunner")
			for (let i = 0; i < gunners.length; i++) {
				const widthQ =
					SERVER_CONFIG.RESOLUTION.WIDTH +
					this.world.QTManager.lrgstRange * 2 +
					50
				const heightQ =
					SERVER_CONFIG.RESOLUTION.HEIGHT +
					this.world.QTManager.lrgstRange * 2 +
					50
				const data = this.world.QTManager.quadtree
					.query(
						new Rectangle(
							gunners[i].pos.x - widthQ / 2,
							gunners[i].pos.y - heightQ / 2,
							widthQ,
							heightQ
						)
					)
					.map(p => p.userData.getMetadata())
				gunners[i].emit("world", data)
				// console.log(roughSizeOfObject(data))
			}
		}, 1000 / 20)
	}
}

function roughSizeOfObject(object) {
	var objectList = []
	var stack = [object]
	var bytes = 0

	while (stack.length) {
		var value = stack.pop()

		if (typeof value === "boolean") {
			bytes += 4
		} else if (typeof value === "string") {
			bytes += value.length * 2
		} else if (typeof value === "number") {
			bytes += 8
		} else if (typeof value === "object" && objectList.indexOf(value) === -1) {
			objectList.push(value)

			for (var i in value) {
				stack.push(value[i])
			}
		}
	}
	return bytes
}
