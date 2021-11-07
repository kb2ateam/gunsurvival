const urlParams = new URLSearchParams(window.location.search);
const serverQuery = urlParams.get("server") || "local";
let ip = "";

switch (serverQuery) {
case "heroku":
	ip = "http://gunsurvival2.herokuapp.com/";
	break;
case "local":
	ip = "http://localhost:3000/";
	break;
case "retardcrap":
	ip = "http://retardcrap.hopto.org:3000/"
	break
default:
	ip = !serverQuery.includes(":") ? serverQuery + ":3000" : serverQuery;
	break;
}
const socket = io(ip, {
	reconnection: false
}); // connect to server

export {
	socket
}
