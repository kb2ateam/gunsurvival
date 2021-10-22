import "./libs/jquery@3.6.0.min.js";
import "./libs/jquery@1.19.2.validate.min.js";
import "./libs/p5@1.3.1.min.js";
import "./libs/sweetalert2@11.js";
import "./libs/SAT@0.9.0.min.js";
// import "./libs/nanoid@3.1.22.browser.min.js";
import Renderer from "./Renderer.js";
import * as World from "./worlds/index.js";

$(document).ready(() => {
	
	$("#wrap-game").bind("contextmenu", e => {
		return false; // disable context menu
	});

	$("#create").click(createRoom);

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
		utils.hideGame(100, () => {
			utils.pauseGame();
			utils.resetGame();
		});
		socket.emit("RoomLeave");
		// $("body").css("overflow", "");
		// $("#respawn").hide();
	});

	$("#respawn").click(() => {
		// respawn function
		socket.emit("room respawn");
		$("#respawn").fadeOut(200);
	});

	$("#chat").keypress(e => {
		// chatting
		if (e.which == 13) {
			socket.emit("room chat", {
				text: $("#chat").val()
			});
			$("#chat").fadeOut(100);
			$("#chat").val("");
		}
	});

	$("#refresh").click(() => {
		// refresh room
		socket.emit("Refresh");
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
			socket.emit("ChangeName", { name });
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
	// end of jquery ready function
});
