import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in';
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckinsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInRepository: InMemoryCheckInRepository;
let gymsRepository: InMemoryGymRepository;
let sut: CheckInUseCase;

describe('CheckIn Use Case', () => {

    beforeEach(async () => {
       checkInRepository = new InMemoryCheckInRepository()
       gymsRepository = new InMemoryGymRepository()
       sut = new CheckInUseCase(checkInRepository, gymsRepository)
       vi.useFakeTimers();

       await gymsRepository.create({
         id: 'gym-id',
         title: 'Javascript Gym',
         description: '',
         latitude: -22.4285323,
         longitude: -43.4864592,
         phone: ''
       })
    })

    afterEach(() => {
        vi.useRealTimers();    })

    it('should be able to check in', async () => {
 
       vi.setSystemTime(new Date(2022,0,20,8,0,0))

       const { checkIn } = await sut.execute({
           gymId: 'gym-id',
           userId: 'user-id',
           userLatitude: -22.4285323,
           userLongitude: -43.4864592
        })

        expect(checkIn.id).toEqual(expect.any(String))
        
    })

    it('should not be able to check in twice in the same day', async () => {    

        vi.setSystemTime(new Date(2022,0,20,8,0,0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -22.4285323,
            userLongitude: -43.4864592
        })

        await expect(() => sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -22.4285323,
            userLongitude: -43.4864592
         }),
        ).rejects.toBeInstanceOf(MaxNumberOfCheckinsError)
    })

    it('should not be able to check in twice but in different days', async () => {    

        vi.setSystemTime(new Date(2022,0,20,8,0,0))

        await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -22.4285323,
            userLongitude: -43.4864592
        })

        vi.setSystemTime(new Date(2022,0,21,8,0,0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-id',
            userId: 'user-id',
            userLatitude: -22.4285323,
            userLongitude: -43.4864592
        })
        
        expect(checkIn.id).toEqual(expect.any(String))
    })


    it('should not be able to check in on distant gym', async () => {    

        await gymsRepository.create({
            id: 'gym-2',
            title: 'Javascript Gym',
            description: '',
            latitude: -27.4285323,
            longitude: -44.4864592,
            phone: ''
        })

        await expect(() => sut.execute({
            gymId: 'gym-2',
            userId: 'user-id',
            userLatitude: -22.4085323,
            userLongitude: -43.4464592
        })).rejects.toBeInstanceOf(MaxDistanceError)
  

    })
 

});