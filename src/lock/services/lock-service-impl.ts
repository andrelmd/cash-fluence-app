import { lockRepository } from "../entities/lock-repository-impl"
import { LockService } from "./lock-service"

export const lockService = new LockService(lockRepository)
