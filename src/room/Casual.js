import Room from "./Room.js"

export default class Casual extends Room {
	constructor(options) {
		super(options);
	}

	async onCreate() {
		this.onMessage('change-weapon', (socket, data) => {});
	}
};
