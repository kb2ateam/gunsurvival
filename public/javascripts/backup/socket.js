import "./libs/socket.io@4.0.1.min.js"
const io = globalThis.io
const Sweetalert2 = globalThis.Sweetalert2

const urlParams = new URLSearchParams(window.location.search);
const serverQuery = urlParams.get("server") || "local"
let ip = "";
switch (serverQuery) {
case "heroku":
	ip = "http://gunsurvival2.herokuapp.com/";
	break;
case "local":
	ip = "http://localhost:3000/";
	break;
case "khoakomlem":
	ip = "http://retardcrap.hopto.org:3000/"
	break
default:
	ip = !serverQuery.includes(":") ? serverQuery + ":3000" : serverQuery;
}
Sweetalert2.fire({
	title: `Hệ thống đang kết nối tới server ${serverQuery}`,
	text: "Vui lòng chờ . . .",
	showConfirmButton: false,
	allowOutsideClick: false,
	allowEscapeKey: true,
	didOpen: Sweetalert2.showLoading
});

const socket = io(ip, {
	reconnection: false
}); // connect to server

export default socket
