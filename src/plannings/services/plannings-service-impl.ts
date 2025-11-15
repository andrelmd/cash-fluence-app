import { planningRepository } from "../entities/planning-repository-impl"
import { PlanningsService } from "./plannings-service"

export const planningsService = new PlanningsService(planningRepository)
