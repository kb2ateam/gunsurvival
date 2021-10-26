import Manager from "./Manager.js"

export default class TagManager extends Manager {
	constructor(tags) {
		super()
		for (let i = 0; i < tags.length; i++)
			this.push(tags[i])
	}

	get(tag) {
		const tmp = super.get(tag)
		if (tmp)
			return tmp.index
		return -1
	}

	push(tag, index = this.length) {
		super.push({
			id: tag,
			index
		})
	}
}
