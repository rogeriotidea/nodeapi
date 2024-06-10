import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-checkins-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe('Validate CheckIn Use Case', () => {

    beforeEach(async () => {
       checkInRepository = new InMemoryCheckInRepository()
       sut = new ValidateCheckInUseCase(checkInRepository)
       vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers();
    })

    it('should be able to validate check-in', async () => {
 
      const createdCheckIn = await checkInRepository.create({
        gym_id: 'gym-01', 
        user_id: 'user-01'
      }) 

      const { checkIn } = await sut.execute({
        checkInId: createdCheckIn.id
      })

      expect(checkIn.validated_at).toEqual(expect.any(Date))
      expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check-in', async () => {
  
       await expect(() => 
           sut.execute({
            checkInId: 'inexistent-check-in-id'
           })
        ).rejects.toThrowError('Resource not found')
        
    })

    it('should not be able to validate the check-in after 20 minutos of its creation', async () => {
      vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

      const createdCheckIn = await checkInRepository.create({
        gym_id: 'gym-01', 
        user_id: 'user-01'
      }) 

      const twentyOneMinutesInMs = 1000 * 60 * 21

      vi.advanceTimersByTime(twentyOneMinutesInMs)
 

      await expect(() => 
          sut.execute({
           checkInId: createdCheckIn.id
      })).rejects.toBeInstanceOf(LateCheckInValidationError)
    
        
   })
    

});