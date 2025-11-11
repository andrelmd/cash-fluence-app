import { invoke } from "@tauri-apps/api/core";

export class Logger {
	static log(...params: any[]) {
		const msg = params.map((message) => (typeof message === "string" ? message : JSON.stringify(message))).join(" ");
		console.log(msg);
		invoke("log", { msg });
	}
}
