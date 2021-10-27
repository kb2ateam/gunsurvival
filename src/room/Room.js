import sizeof from "object-sizeof"
import { Circle } from "../universal/libs/Quadtree.js"
import ServerConfig from "../universal/configs/Server.js"
import Tag from "../universal/enums/Tag.js"
import uniqid from "uniqid"
import Manager from "../universal/manager/Manager.js"

export default class Room {
	sockets = new Manager()
	isPaused = true
	isRemoved = false
	timeCreate = Date.now()
	eventHandlers = {
		"room-leave": async socket => {
			try {
				await this.onLeave(socket, true)
				this.onAnyLeave(socket)
			} catch (e) {
				socket.emit("error", e.message)
			}
		}
	}

	constructor({
		id = uniqid(),
		gameServer,
		master,
		description = "New Game!",
		maxPlayer = 1,
		password = ""
	}) {
		this.id = id
		this.gameServer = gameServer
		this.master = master
		this.description = description
		this.maxPlayer = maxPlayer
		this.password = password
		this.onCreate()
	}

	// override
	async onCreate() {}

	// override
	async onJoin(socket, options) {}

	// override
	async onLeave(socket, consented) {}

	// override
	async onDispose() {}

	get plainData() {
		return {
			id: this.id,
			master: this.master,
			description: this.description,
			maxPlayer: this.maxPlayer,
			playing: this.game.length,
			timeCreate: this.timeCreate
		}
	}

	emit(eventName, ...args) {
		this.gameServer.io.to(this.id).emit(eventName, ...args)
	}

	async requestJoin(socket, options) {
		if (this.sockets.get(socket.id))
			throw new Error("Bạn đã tham gia phòng này rồi!")
		if (this.sockets.length >= this.maxPlayer) {
			if (this.id.includes("lobby"))
				throw new Error("Sảnh chờ quá tải, hãy thử tải lại trang!")
			throw new Error("Phòng đã đủ số lượng người chơi!")
		}
		await this.onJoin(socket, options)
		socket.join(this.id)
		this.sockets.push(socket)
	}

	onMessage(eventName, cb) {
		this.eventHandlers[eventName] = cb
		// returns a method to unbind the callback
		return () => delete this.eventHandlers[eventName]
	}

	onAnyLeave(socket) {
		// consented and not consented
		this.emit("room-leave", socket.id)
		socket.leave(this.id)
		this.sockets.remove(socket.id)
		if (this.sockets.length <= 0) this.destroy()
	}

	destroy() {
		for (let i = 0; i < this.sockets.length; i++) {
			this.sockets[i].leave(this.id)
		}
		this.isRemoved = true
	}

	start() {
		this.isPaused = false
	}

	pause() {
		this.isPaused = true
	}

	sendUpdates() {
		const gunners = this.world.getSpritesByTag(Tag.GUNNER)
		for (let i = 0; i < gunners.length; i++) {
			const gunner = gunners[i]
			const { WIDTH, HEIGHT } = ServerConfig.RESOLUTION
			const QTManager = this.world.QTManager
			const socket = this.sockets.get(gunner.id)
			const { x, y, r } = gunner.QTRigid

			const data = QTManager.quadtree
				.query(
					new Circle(
						x,
						y,
						QTManager.lrgstRadius
					)
				)
				.filter(point => {
					const distance = dist(point, gunner.pos)
					return (distance <= (WIDTH + HEIGHT) / 4) || // (width + height / 2) = duong kinh duong tron noi tiep trung binh
						(point.userData.QTRigid.r > r) // tat ca cac vat the lon 
				}).map(point => point.userData.plainData)
			socket && socket.emit("world", data)
			this.gameServer.totalSent += sizeof(data)
		}
	}
}

function dist(pos1, pos2) {
	return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
}
