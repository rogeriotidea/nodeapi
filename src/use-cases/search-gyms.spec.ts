import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    })

    it('should be able to search for gyms', async () => {

      await gymsRepository.create({
        title: 'Gym 1',
        description: null,
        phone: null,
        latitude: -27.4285323,
        longitude: -44.4864592,
      })

      await gymsRepository.create({
        title: 'Gym 2',
        description: null,
        phone: null,
        latitude: -27.4285323,
        longitude: -44.4864592,
      }) 

      const { gyms } = await sut.execute({
        query: 'Gym',
        page: 1  
      })

      expect(gyms).toHaveLength(2)

    })


    it('should be able to fetch paginated gym search', async () => {

        for (let i = 1; i<=22; i++) {
            await gymsRepository.create({
                title: `Gym ${i}`,
                description: null,
                phone: null,
                latitude: -27.4285323,
                longitude: -44.4864592,
              })
        }

        const { gyms } = await sut.execute({
           query: 'Gym',
           page: 2
        })
 
        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Gym 21' }),
            expect.objectContaining({ title: 'Gym 22' })
        ])
        
    })

})
