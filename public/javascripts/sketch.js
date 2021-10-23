export default new p5(function (sketch) {
	const renderer = new Renderer();
	renderer.inject(sketch);
	renderer.add(new World.Lobby({ socket }));
	renderer.switchTo(0);

	socket.onAny(async (eventName, ...args) => {
		for (let i = 0; i < renderer.items.length; i++) {
			const cb = renderer.items[i] ? .onMessageHandlers[eventName];
			try {
				if (cb) await cb(...args);
			} catch (e) {
				console.log(e);
			}
		}
	});
});
