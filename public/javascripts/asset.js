const imageDir = "/images/"
const GlobalAssets = {}
export default GlobalAssets

export function loadAssets(sketch, assetPaths = []) {
	const assets = []
	for (let i = 0; i < assetPaths.length; i++) {
		const path = assetPaths[i]
		if (GlobalAssets[path])
			assets.push(GlobalAssets[path])
		else {
			GlobalAssets[path] = sketch.loadImage(imageDir + path)
			assets.push(GlobalAssets[path])
		}
	}
	return assets
}

globalThis.GlobalAssets = GlobalAssets
