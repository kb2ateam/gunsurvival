/**
 * Màu mè, hoa lá cho terminal<br>
 * Hướng dẫn sử dụng:<br>
 * <code>import {log, debug} from "./console.js"</code>
 * @module CONSOLE
 */
import chalk from "chalk"
import objectPath from "object-path"

let prefixTag = []

function recursiveGet(object, properties) {
	if (properties.length == 1) return object[properties[0]]
	const tmp = object[properties[0]]
	properties.splice(0, 1)
	return recursiveGet(tmp, properties)
}

export function setPrefix(prefix, opts = []) {
	return prefixTag = [
		prefix,
		opts
	]
}

export function log(messageOpts, tags = []) {
	const defaultFn = () => "null"
	if (prefixTag.length > 0)
		tags = [prefixTag, tags]
	const prefix = tags.map(tag => recursiveGet(chalk, tag[1])(tag[0])).join(" ")
	const message = recursiveGet(chalk, messageOpts[1])(messageOpts[0])
	console.log(prefix + " " + message)
}

export function debug(message, tags = []) {
	log([
		message,
		["cyan"]
	], [
		[
			"DEBUG",
			["white", "bgCyan"]
		], ...tags
	])
}

export function error(message, tags = []) {
	log([
		message,
		["white"]
	], [
		[
			"ERROR",
			["white", "bgRed"]
		], ...tags
	])
}

export function done(message, tags = []) {
	log([
		message,
		["green"]
	], [
		[
			"DONE",
			["white", "bgGreen"]
		], ...tags
	])
}

export function success(message, tags = []) {
	log([
		message,
		["green"]
	], [
		[
			"DONE",
			["white", "bgGreen"]
		], ...tags
	])
}

export function info(message, tags = []) {
	log([
		message,
		["green"]
	], [
		[
			"INFO",
			["white", "bgGreen"]
		], ...tags
	])
}

export function warn(message, tags = []) {
	log([
		message,
		["yellow"]
	], [
		[
			"DONE",
			["white", "bgYellow"]
		], ...tags
	])
}

export const setTerminalTitle = text => {
	process.stdout.write(
		`${String.fromCharCode(27)}]0${text}${String.fromCharCode(7)}`
	)
}
