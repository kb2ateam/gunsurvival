const $ = globalThis.jQuery

export function showGame(timer = 100, callback) {
	$("#menu").fadeOut(timer, "", () => {
		if (callback) callback();
		$("#menu").hide();
		$("body").css("overflow", "hidden");
		$("#wrap-game").fadeIn(timer);
	});
}

export function hideGame(timer = 100, callback) {
	$("#wrap-game").fadeOut(timer, "", () => {
		if (callback) callback();
		$("#wrap-game").hide();
		$("body").css("overflow", "");
		$("#menu").fadeIn(500);
	});
}

export function updateRoom ({
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
			socket.emit("RoomJoin", { id });
		});
	}
}

export async function createRoom () {
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
			background: `url('${ip}img/avatarpage-min.png') no-repeat center center`,
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
				socket.emit("RoomCreate", option);
				Sweetalert2.showLoading();
			}
		});
	};
	if (optionSweetalert2s.hasOwnProperty(mode)) {
		optionSweetalert2s[mode]();
	}
}
