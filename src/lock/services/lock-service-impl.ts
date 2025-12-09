import { databaseService } from "../../database/services/database-service-impl"
import { LockService } from "./lock-service"

export const lockService = new LockService(databaseService)
