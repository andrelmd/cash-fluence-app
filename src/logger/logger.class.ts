import { invoke } from "@tauri-apps/api/core"

export class Logger {
	static log(...params: any[]) {
		let msg = params.map((message) => (typeof message === "string" ? message : JSON.stringify(message))).join(" ")
		msg = `[${new Date().toISOString()}] [LOG]: ${msg}`
		console.log(msg)
		invoke("log", { msg })
	}

	static error(...params: any[]) {
		let msg = params.map((message) => (typeof message === "string" ? message : JSON.stringify(message))).join(" ")
		msg = `[${new Date().toISOString()}] [ERROR]: ${msg}`
		console.log(msg)
		invoke("log", { msg })
	}
}
