import { invoke } from "@tauri-apps/api/core";

export class Logger {
	static log(message: string) {
		invoke("log", { msg: message });
	}
}
