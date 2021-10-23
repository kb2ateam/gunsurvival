const imageDir = "images/";
const imagePaths = [
	"Gunner.png",
	"Bush.png",
	"Rock.png",
	"Bullet.png",
	"terrorist.png"
];

const GlobalAssets = {
	cursor: {
		default: "cursors/aim.cur"
	},
	images: {}
};

const loadAssets = async ({ sketch, onProgress, onError, onDone }) => {
	let loadedCount = 0;
	let hasError = false;
	for (const path of imagePaths) {
		sketch.loadImage(
			imageDir + path,
			p5Image => {
				loadedCount++;
				onProgress && onProgress(loadedCount);
				GlobalAssets.images[path] = p5Image;

				if (loadedCount == imagePaths.length && !hasError)
					onDone && onDone(loadedCount);
			},
			error => {
				loadedCount++;
				onError && onError(error);
				if (loadedCount == imagePaths.length && !hasError)
					onDone && onDone(loadedCount);
			}
		);
	}
};

export function loadAssets(sketch, assetPaths) {
	const promises = []
	for (let i = 0; i < assetPaths.length; i++) {
		const path = assetPaths[i]
		promises.push(new Promise(resolve => {
			sketch.loadImage(
				imageDir + path,
				resolve,
				reject
			);
		}))
	}
	return Promise.all(promises)
}

export default GlobalAssets;
export { GlobalAssets, loadAssets, imagePaths };
export const { cursors, images } = GlobalAssets;
