import { databaseService } from "../../database/services/database-service-impl"
import { PlanningRepository } from "./planning-repository"

export const planningRepository = new PlanningRepository(databaseService, "plannings")
