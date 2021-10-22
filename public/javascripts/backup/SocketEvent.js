import socket from './socket.js'

socket.on('connect', () => {
	// Sweetalert2.fire({
	// 	title: 'Thành công!',
	// 	text: 'Đã kết nối tới server!',
	// 	icon: 'success',
	// 	allowOutsideClick: false,
	// 	allowEscapeKey: false
	// });
	socket.emit('lobby-join');
	socket.emit('_ping', Date.now());
});

// socket.on('connect', () => {
// 	// connect to server successfully
// 	socket.emit('Refresh');
// 	utils.hideGame();
// 	// $('#exit').click();
// 	Swal.fire({
// 		title: 'Yolo!',
// 		text: 'Đã kết nối tới server!',
// 		icon: 'success',
// 		footer: '<a href=\'#\' id=\'displayReason\'>Tại sao lại hiện bảng này?</a>',
// 		background: 'url(\'./images/avatarpage-min.png\') no-repeat center center',
// 		allowOutsideClick: false,
// 		allowEscapeKey: false,
// 		onOpen: () => {
// 			$('#displayReason').click(displayReason);
// 			setTimeout(() => {
// 				Swal.close();
// 			}, 1000);
// 		}
// 	});
// });

socket.on('alert dialog', text => {
	Swal.fire({
		icon: 'error',
		title: 'Oops...',
		text
	});
});

socket.on('alert toast', text => {
	Toast.fire({
		icon: 'info',
		title: text
	});
});

socket.on('alert', swalOption => Swal.fire(swalOption));

socket.on('RoomCreate', roomOption => {
	// response from RoomCreate
	Toast.fire({
		icon: 'success',
		title: `Đã tạo thành công phòng với mã ID: ${roomOption.id}`
	});
	socket.emit('RoomJoin', {
		id: roomOption.id
	});
});

socket.on('updaterooms', roomOptions => {
	// update rooms infomations
	if (Array.isArray(roomOptions)) {
		// is Array
		if (roomOptions.length == 0) {
			$('#table').html('');
		} else {
			for (const roomOption of roomOptions) {
				utils.updateRoom(roomOption);
			}
		}
	} else {
		// is Object
		utils.updateRoom(roomOptions);
	}
});

socket.on('RoomJoin', player => {
	// response from RoomJoin
	if (player.id != socket.id) {
		Toast.fire({
			icon: 'info',
			title: `${player.name} đã vào phòng!`
		});
	} else {
		utils.showGame();
		utils.resetGame();
		utils.resumeGame();
	}
});

socket.on('room delete', id => {
	$(`#${id}`).remove();
});

socket.on('online', online => {
	$('#online').html(online);
});

socket.on('connect_error', error => {
	// disconnect or unknown server
	console.log(error);
	$('#exit').click();
	if ($('.swal2-icon-error').length > 0)
		// check exists
		return;
	Swal.fire({
		title: 'Ooops!',
		text: 'Có vẻ như server đã offline :(',
		icon: 'error',
		// footer: '<a onclick='changeServer()' href='#'>Bấm vào đây để đổi server</a>',
		allowOutsideClick: false,
		allowEscapeKey: false
	});
});

socket.on('pong', timeSent => {
	socket.emit('_ping', Date.now());
});

socket.on('lobby-join', SERVER_CONFIG => {
	Sweetalert2.close();
	window.SERVER_CONFIG = SERVER_CONFIG;
	new p5(function (sketch) {
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
});

// export default ({ utils, socket, Swal = window.Swal, $ = window.jQuery }) => {
// 	const Toast = Swal.mixin({
// 		toast: true,
// 		position: 'top-end',
// 		showConfirmButton: false,
// 		timer: 3000,
// 		timerProgressBar: true,
// 		background: '#003366',
// 		onOpen: toast => {
// 			// toast.style.backgroundColor = '';
// 			toast.addEventListener('mouseenter', Swal.stopTimer);
// 			toast.addEventListener('mouseleave', Swal.resumeTimer);
// 		}
// 	});

// 	const displayReason = () => {
// 		Swal.fire({
// 			title: 'KB2A - TEAM',
// 			text: 'Do team bọn mình không đủ tiền để thuê server :)) nên mình lấy máy của mình (khoa ko mlem) làm server luôn. Mà máy mình đâu online thường xuyên nên đã làm server heroku để dự phòng (server này ping khoảng 200ms)',
// 			icon: 'info',
// 			background: 'url(\'./images/avatarpage-min.png\') no-repeat center center',
// 			allowOutsideClick: false,
// 			allowEscapeKey: false
// 		});
// 	};


// };
