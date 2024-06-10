import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms';

let gymsRepository: InMemoryGymRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {

    beforeEach(() => {
        gymsRepository = new InMemoryGymRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    })

    it('should be able to fetch near by gyms', async () => {

      await gymsRepository.create({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -27.4285323,
        longitude: -44.4864592,
      })

      await gymsRepository.create({
        title: 'Far Gym',
        description: null,
        phone: null,
        latitude: -28.4285323,
        longitude: -45.4864592,
      }) 

      const { gyms } = await sut.execute({
        userLatitude: -27.4285323,
        userLongitude: -44.4864592, 
      })

      expect(gyms).toHaveLength(1)
      expect(gyms).toEqual([
        expect.objectContaining({ title: 'Near Gym' })
      ])
    

  })



})
