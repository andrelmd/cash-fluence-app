import { Dayjs } from "dayjs"

export class Lock {
	key: string
	expiresAt: Dayjs

	constructor({ key, expiresAt }: { key: string; expiresAt: Dayjs }) {
		this.key = key
		this.expiresAt = expiresAt
	}
}
