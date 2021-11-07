import Renderer from "./Renderer.js"
import * as Room from "./room/index.js";
import { Toast, success, error } from "./helpers/sweetalert.js"

const { io, PIXI, Sweetalert2, $, p5 } = globalThis

export default class Gunsurvival {
	ip = null
	socket = null
	pixiApp = null

	constructor({
		ip = "localhost",
	}) {
		this.ip = ip
		this.bindJqueryEvents()
	}

	connect(ip) {
		if (ip) this.ip = ip
		Sweetalert2.fire({
			title: `Hệ thống đang kết nối tới ${this.ip}`,
			text: "Vui lòng chờ . . .",
			showConfirmButton: false,
			allowOutsideClick: false,
			allowEscapeKey: true,
			didOpen: () => Sweetalert2.showLoading()
		});
		this.socket = io(this.ip, {
			reconnection: false
		}); // connect to server
		this.socket.on("connect", () => {
			// Sweetalert2.fire({
			// 	title: "Thành công!",
			// 	text: "Đã kết nối tới server!",
			// 	icon: "success",
			// 	allowOutsideClick: false,
			// 	allowEscapeKey: false
			// });
			this.socket.emit("lobby-join");
			this.socket.emit("hello", Date.now());
		});

		this.socket.on("hi", timeSent => {
			const latency = Date.now() - timeSent
			$("#ping").html(latency)

			setTimeout(() => {
				this.socket.emit("hello", Date.now());
			}, 1000)
		});

		this.socket.on("lobby-join", SERVER_CONFIG => {
			Sweetalert2.close();
			window.SERVER_CONFIG = SERVER_CONFIG;
			const thatSocket = this.socket
			// new p5(function (sketch) {
			// 	const renderer = new Renderer();
			// 	renderer.inject(sketch);
			// 	renderer.push(new Room.Lobby({ socket: thatSocket }));
			// 	renderer.switchTo(0);

			// 	thatSocket.onAny(async (eventName, ...args) => {
			// 		for (let i = 0; i < renderer.length; i++) {
			// 			const cb = renderer[i].onMessageHandlers[eventName];
			// 			try {
			// 				if (cb) await cb(...args);
			// 			} catch (e) {
			// 				console.error(e);
			// 			}
			// 		}
			// 	});
			// });
		});

		this.socket.on("connect_error", error => {
			// disconnect or unknown server
			console.log(error);
			$("#exit").click();
			if ($(".Sweetalert22-icon-error").length > 0)
				// check exists
				return;
			Sweetalert2.fire({
				title: "Ooops!",
				text: "Có vẻ như server đã offline :(",
				icon: "error",
				// footer: '<a onclick="changeServer()" href="#">Bấm vào đây để đổi server</a>',
				allowOutsideClick: false,
				allowEscapeKey: false
			});
		});

		this.socket.on("alert dialog", text => {
			Sweetalert2.fire({
				icon: "error",
				title: "Oops...",
				text
			});
		});

		this.socket.on("alert toast", text => {
			Toast.fire({
				icon: "info",
				title: text
			});
		});

		this.socket.on("alert", Sweetalert2Option =>
			Sweetalert2.fire(Sweetalert2Option)
		);
	}

	play() {
		this.pixiApp = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight
		})
		window.a = this.pixiApp
		document.body.appendChild(this.pixiApp.view);
		const app = this.pixiApp
		const viewport = new PIXI.Viewport({
			screenWidth: window.innerWidth,
			screenHeight: window.innerHeight,
			worldWidth: 1000,
			worldHeight: 1000,

			interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
		})

		// add the viewport to the stage
		app.stage.addChild(viewport)

		// activate plugins
		viewport
			.drag()
			.pinch()
			.wheel()
			.decelerate()
		// viewport.follow(a, {speed: 5, acceleration: 0.2})
	}

	bindJqueryEvents() {
		$("#wrap-game").bind("contextmenu", () => {
			return false; // disable context menu
		});

		$("#create").click(this.createRoom.bind(this));

		$("#error").click(() => {
			// bug reporting
			Sweetalert2.fire({
				title: "Helo :3",
				text: "Nếu tìm thấy lỗi vui lòng chụp ảnh màn hình lỗi và gửi cho tui mau!!",
				icon: "info",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Vào trang cá nhân của tác giả!"
			}).then(result => {
				if (result.value) {
					window.open("https://www.facebook.com/khoakomlem", "_blank");
				}
			});
		});

		$("#exit").click(() => {
			// exit game
			this.hideGame(100, () => {
				this.pauseGame();
				this.resetGame();
			});
			this.socket.emit("RoomLeave");
			// $("body").css("overflow", "");
			// $("#respawn").hide();
		});

		$("#respawn").click(() => {
			// respawn function
			this.socket.emit("room respawn");
			$("#respawn").fadeOut(200);
		});

		$("#chat").keypress(e => {
			// chatting
			if (e.which == 13) {
				this.socket.emit("room chat", {
					text: $("#chat").val()
				});
				$("#chat").fadeOut(100);
				$("#chat").val("");
			}
		});

		$("#refresh").click(() => {
			// refresh room
			this.socket.emit("Refresh");
		});

		$("#rename").click(async () => {
			// change name
			const { value: name } = await Sweetalert2.fire({
				input: "text",
				inputAttributes: {
					autocapitalize: "on",
					maxlength: 20,
					placeholder: "Hãy nhập tên của bạn . . ."
				},
				showCancelButton: true,
				background: "url('../../img/menu-min.png')  no-repeat center center"
			});
			if (name) {
				this.socket.emit("ChangeName", { name });
			}
		});

		$("#page").click(() => {
			// link to KB2A PAGE
			window.open("https://www.facebook.com/KB2A.Team/", "_blank");
		});

		$(".column100").on("mouseover", () => {
			const table1 = $(this)
				.parent()
				.parent()
				.parent();
			const table2 = $(this)
				.parent()
				.parent();
			const verTable = $(table1).data("vertable") + "";
			const column = $(this).data("column") + "";

			$(table2)
				.find("." + column)
				.addClass("hov-column-" + verTable);
			$(table1)
				.find(".row100.head ." + column)
				.addClass("hov-column-head-" + verTable);
		});

		$(".column100").on("mouseout", () => {
			const table1 = $(this)
				.parent()
				.parent()
				.parent();
			const table2 = $(this)
				.parent()
				.parent();
			const verTable = $(table1).data("vertable") + "";
			const column = $(this).data("column") + "";

			$(table2)
				.find("." + column)
				.removeClass("hov-column-" + verTable);
			$(table1)
				.find(".row100.head ." + column)
				.removeClass("hov-column-head-" + verTable);
		});
	}

	showGame(timer = 100) {
		return new Promise(resolve => {
			$("#menu").fadeOut(timer, "", () => {
				$("#menu").hide();
				$("body").css("overflow", "hidden");
				$("#wrap-game").fadeIn(timer);
				resolve()
			});
		})
	}

	hideGame(timer = 100) {
		return new Promise(resolve => {
			$("#wrap-game").fadeOut(timer, "", () => {
				$("#wrap-game").hide();
				$("body").css("overflow", "");
				$("#menu").fadeIn(500);
				resolve()
			});
		})
	}

	updateRoom({
		master,
		id,
		text,
		maxPlayer,
		timeCreate,
		playing
	} = {}) {
		const thaotac =
			playing.length >= maxPlayer ?
			"style='color: red; cursor:no-drop'>Fulled" :
			"style = 'color: green; cursor:pointer'>VÀO!!";
		const time = new Date(timeCreate);
		const datetime = `${time.getDate()}/${time.getMonth()} ${time.getHours()}:${time.getMinutes()}`;
		const htmlContent = // td
			`<td class="column100 column1" data-column="column1" >${master}</td>` +
			`<td class="column100 column2" data-column="column2">${id}</td>` +
			`<td class="column100 column3" data-column="column3">${text}</td>` +
			`<td class="column100 column4" data-column="column4">${playing.length}/${maxPlayer}</td>` +
			`<td class="column100 column5" data-column="column5">${datetime}</td>` +
			`<td class="column100 column6 noselect" data-column="column6" ${thaotac}</td>`;
		// check element exists
		if ($(`#${id}`).length > 0) {
			//is exists
			$(`#${id}`).html(htmlContent);
		} else {
			// is not exists
			$("#table").append(`<tr id = "${id}">${htmlContent}</tr>`);
			$(`#${id} > td:last`).click(() => {
				this.socket.emit("RoomJoin", { id });
			});
		}
	}

	async createRoom() {
		const modes = ["Creative", "King", "Pubg", "Csgo"];
		const htmlOptions = (() => {
			let output = "";
			for (const mode of modes) {
				output += `<option value="${mode}">${mode.toUpperCase()}</option>`;
			}
			return output;
		})();
		const { value: mode } = await Sweetalert2.fire({
			title: "Tạo Phòng",
			html: `<select id="mode" name="mode" class="Sweetalert22-input">${htmlOptions}</select>`,
			showCancelButton: true,
			background: "url('./images/avatarpage-min.png') no-repeat center center",
			preConfirm: () => {
				return $("#mode").val();
			}
		});
		// second dialog
		const optionSweetalert2s = {};
		optionSweetalert2s["Creative"] = optionSweetalert2s["King"] = () => {
			Sweetalert2.fire({
				title: "Tùy chọn game",
				html: "<form id='option_form'>" +
					"<label for='Sweetalert2-input1'>Nhập số lượng người chơi có thể vào</label>" +
					"<input placeholder='Max player' type='number' name='maxplayer' id='Sweetalert2-input1' class='Sweetalert22-input'>" +
					"<input placeholder='Dòng thông điệp' name='text' maxLength='30' id='Sweetalert2-input2' class='Sweetalert22-input'>" +
					"</form>",
				allowOutsideClick: false,
				showCancelButton: true,
				background: `url('${this.ip}img/avatarpage-min.png') no-repeat center center`,
				preConfirm: () => {
					$("#option_form").validate({
						rules: {
							maxplayer: {
								required: true,
								range: [5, 15]
							}
						},
						messages: {
							maxplayer: {
								required: "Bạn phải điền ô này",
								range: "5 đến 15 bruh"
							}
						}
					});
					if (!$("#option_form").valid()) return false;
					const option = {
						mode,
						maxPlayer: $("#option_form > input[name='maxplayer']").val(),
						text: $("#option_form > input[name='text']").val()
					};
					this.socket.emit("RoomCreate", option);
					Sweetalert2.showLoading();
				}
			});
		};
		if (optionSweetalert2s.hasOwnProperty(mode)) {
			optionSweetalert2s[mode]();
		}
	}
}
