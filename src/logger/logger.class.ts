import { invoke } from "@tauri-apps/api/core";

export class Logger {
	static log(message: any) {
		const msg = typeof message === "string" ? message : JSON.stringify(message);
		invoke("log", { msg });
	}
}
