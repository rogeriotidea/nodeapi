
import { PrismaCheckInsRepository } from "@/repositories/prisma/prima-check-ins-repository"
import { GetUserMetricsUseCase } from "../get-user-metrics"

export function makeGetUserMetricsUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new GetUserMetricsUseCase(checkInsRepository)

    return useCase

}   