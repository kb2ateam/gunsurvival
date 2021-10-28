import Room from "./Room.js"
import Sprite, * as Sprites from "../universal/animation/sprite/index.js"
import { Normal as NormalWorld } from "../universal/world/index.js"

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
			const player = this.world.find(socket.id)
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
			const player = this.world.find(socket.id)
			if (!player) return
			const [isPressing, angle] = event
			if (isPressing === true) player.shoot(angle)

			if (isPressing === false) player.stopShoot(angle)
		})

		this.onMessage("rotate", (socket, angle = 0) => {
			const player = this.world.find(socket.id)
			if (!player) return
			player.rotateTo(angle)
		})
	}

	async onJoin(socket) {
		socket.data.currentLobby = this.id
		const player = new Sprites.Gunner({
			world: this.world,
			id: socket.id
		})
		this.world.add(player)
		socket.data.player = player
		this.start()
	}

	async onLeave(socket, consented) {
		if (!consented && socket.data.player instanceof Sprite)
			return this.world.remove(socket.data.player)
		if (
			socket.data.currentLobby &&
			socket.data.currentLobby != "lobby" + socket.id
		) {
			this.remove({ id: socket.id })
			await this.rooms["lobby" + socket.id].requestJoin(socket)
		} else {
			throw new Error("Bạn không thể thoát lobby của chính mình!")
		}
		this.world.remove(socket.data.player)
	}
}
