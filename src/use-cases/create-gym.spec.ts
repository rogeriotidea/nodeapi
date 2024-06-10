import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { CreateGymUseCase } from './create-gym';

let gymsRepository: InMemoryGymRepository;
let sut: CreateGymUseCase;

describe('Create Gym Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository();
        sut = new CreateGymUseCase(gymsRepository);
    })

    it('should be able to create gym', async () => {

        const { gym } = await sut.execute({
            title: 'Javascript gym',
            description: null,
            phone: null,
            latitude: -27.4285323,
            longitude: -44.4864592,
        });   
 
        expect (gym.id).toEqual(expect.any(String))
        
    })

})
