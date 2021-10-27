import Room from "./Room.js"

export default class Lobby extends Room {
	keyPressed(sketch) {
		switch (sketch.key.toLowerCase()) {
		case "w":
			this.socket.emit("moving", { up: true });
			break;
		case "s":
			this.socket.emit("moving", { down: true });
			break;
		case "a":
			this.socket.emit("moving", { left: true });
			break;
		case "d":
			this.socket.emit("moving", { right: true });
			break;
		}
	}

	keyReleased(sketch) {
		switch (sketch.key.toLowerCase()) {
		case "w":
			this.socket.emit("moving", { up: false });
			break;
		case "s":
			this.socket.emit("moving", { down: false });
			break;
		case "a":
			this.socket.emit("moving", { left: false });
			break;
		case "d":
			this.socket.emit("moving", { right: false });
			break;
		}
	}

	mousePressed(sketch, event) {
		const screenPos = this.camera.worldToScreen(sketch, this.me.pos);
		switch (event.button) {
		case 0:
			this.socket.emit("shoot", [
				true,
				Math.atan2(sketch.mouseY - screenPos.y, sketch.mouseX - screenPos.x)
			]);
			break;
		}
	}

	mouseReleased(sketch, event) {
		const screenPos = this.camera.worldToScreen(sketch, this.me.pos);
		switch (event.button) {
		case 0:
			this.socket.emit("shoot", [
				false,
				Math.atan2(sketch.mouseY - screenPos.y, sketch.mouseX - screenPos.x)
			]);
			break;
		}
	}
}
