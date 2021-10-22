// export default function imageLoader({
// 	sketch,
// 	listName = [],
// 	dir = "./images/",
// 	successCallback,
// 	failureCallback
// }) {
// 	const store = {};
// 	for (const name of listName) {
// 		const filename = name + "-min.png";
// 		store[name] = s.loadImage(dir + filename, () => {
// 			store[name].tint = s.createGraphics(
// 				store[name].width,
// 				store[name].height
// 			);
// 			store[name].tint.tint(255, 70);
// 			store[name].tint.image(store[name], 0, 0);
// 			store[name].tint.noTint();
// 			successCallback();
// 		});
// 	}
// 	return store;
// }

export const AssetPaths = ["Gunner.png", "Bush.png", "Rock.png"];

export const loadAssets = async ({sketch, onProgress, onError, onDone}) => {
	let loadedCount = 0;
	let hasError = false;
	for (const path of AssetPaths) {
		sketch.loadImage(
			this.imageDir + path,
			() => {
				loadedCount++;
				onProgress && onProgress(loadedCount);
				if (loadedCount == AssetPaths.length && !hasError)
					onSuccess && onSuccess();
			},
			() => {}
		);
	}
};

export default GlobalAssets = {};

/*
        	for (let i in listImages) {
            const file = listImages[i];
            const name = /^(.*)\-min\.png$/.exec(file)[1];
            let count = 0;
            store[name] = s.loadImage(ip + "img/" + file, () => {
                if (++this.count == listImages.length) {
                    // $("#swal2-content").html("Chờ xử lí hình ảnh :V");
                    this.drawTint(s, store, () => {
                        // $("#swal2-content").html("Đã xong!");
                        // swal.hideLoading();
                        // setTimeout(swal.close, 1000);
                    });
                } else {
                    // $("#swal2-content").html("Chờ tải game: " + Math.round(this.count / listImages.length * 100) + "%");
                }
            });
        }
        */
