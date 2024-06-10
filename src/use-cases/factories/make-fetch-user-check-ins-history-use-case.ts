
import { PrismaCheckInsRepository } from "@/repositories/prisma/prima-check-ins-repository"
import { FetchUserCheckinsHistoryUseCase } from "../fetch-user-checkins-history"

export function makeFetchUserCheckInsHistoryUseCase(){
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new FetchUserCheckinsHistoryUseCase(checkInsRepository)

    return useCase

}   