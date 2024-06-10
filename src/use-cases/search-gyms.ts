
import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository){}

  async execute({ 
    query,
    page
   }: SearchGymsUseCaseRequest):Promise<SearchGymsUseCaseResponse> {
  
    const gyms = await this.gymsRepository.searchMany(
        query,
        page
    )

    return {
      gyms
    }
  }
}
