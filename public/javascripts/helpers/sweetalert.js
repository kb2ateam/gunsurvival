const { Sweetalert2 } = globalThis

export const Toast = () =>
	Sweetalert2.mixin({
		toast: true,
		position: "top-end",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		background: "#003366",
		didOpen: toast => {
			toast.addEventListener("mouseenter", Sweetalert2.stopTimer);
			toast.addEventListener("mouseleave", Sweetalert2.resumeTimer);
		}
	});

export const success = text =>
	Sweetalert2.fire({
		icon: "success",
		title: "Thành công!",
		text: typeof text == "object" ? undefined : text
	});

export const error = text =>
	Sweetalert2.fire({
		icon: "error",
		title: "Lỗi!",
		text: typeof text == "object" ? undefined : text
	});
