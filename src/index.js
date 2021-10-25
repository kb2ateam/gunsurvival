import dotenv from "dotenv"
dotenv.config()

import http from "http"
import dirname from "es-dirname"
import path from "path"
import express from "express"
import { Server } from "socket.io"

import { setTerminalTitle } from "./helpers/console.js"
import { init } from "./helpers/serverline.js"
import Gunsurvival from "./Gunsurvival.js"

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port = process.env.PORT || 3000
const gameServer = new Gunsurvival(io)
gameServer.start()
// init("Gunsurvival> ")

let lastTPS = 0
setInterval(() => {
	const memoryUsage = process.memoryUsage().heapTotal / 1024 / 1024
	let symbol = "="
	if (gameServer.tps > lastTPS) symbol = "↑"
	if (gameServer.tps < lastTPS) symbol = "↓"
	setTerminalTitle(
		`GUNSURVIVAL DEDICATED SERVER - MEMORY: ${memoryUsage.toFixed(
			2
		)}MB - TICKRATES: ${gameServer.tps}${symbol}`)
	lastTPS = gameServer.tps
}, 3000)

app.use(express.static(path.join(dirname(), "universal")))
app.use(express.static(path.join(dirname(), "../public")))

server.listen(port, () => console.log("Server started on :*" + port))
