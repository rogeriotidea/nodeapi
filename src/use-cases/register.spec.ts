import { describe, it, test, expect } from 'vitest'
import { RegisterUseCase } from './register';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository';
import { compare } from 'bcryptjs';
import exp from 'constants';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';

describe('Register Use Case', () => {

    it('should be able to register', async () => {

        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);
        const { user } = await registerUseCase.execute({
            name: 'John doe',
            email: 'john23@john.com.br',
            password: '123456'
        });   
 
        expect (user.id).toEqual(expect.any(String))
        
    })

    it('should hash user password upon registration', async () => {

        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);
        const { user } = await registerUseCase.execute({
            name: 'John doe',
            email: 'john23@john.com.br',
            password: '123456'
        });  

        const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);
        expect(isPasswordCorrectlyHashed).toBe(true);
        
    })

    it('should not be able to register with same email twice', async () => {

        const usersRepository = new InMemoryUsersRepository();
        const registerUseCase = new RegisterUseCase(usersRepository);

        const email = 'jonhdoe@example.com';

        await registerUseCase.execute({
            name: 'John doe',
            email,
            password: '123456'
        });  

        await expect(() => registerUseCase.execute({
            name: 'John doe',
            email,
            password: '123456'
        })).rejects.toBeInstanceOf(UserAlreadyExistsError)

        
    })
})
