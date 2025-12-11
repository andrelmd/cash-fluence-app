import { Tables } from "../../database/constants/tables"
import { databaseService } from "../../database/services/database-service-impl"
import { LockRepository } from "./lock-repository"

export const lockRepository = new LockRepository(databaseService, Tables.LOCKS)
