import Manager from "./Manager.js"

export default class TagManager extends Manager {
	constructor(tags) {
		super()
		for (let i = 0; i < tags.length; i++)
			this.push(tags[i])
	}

	get(id) {
		const tag = super.get(id)
		if (tag)
			return tag.tag
	}

	push(tag, index = this.length) {
		super.push({
			id: index,
			tag
		})
	}
}
