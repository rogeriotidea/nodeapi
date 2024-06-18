import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Checkin Create (e2e)', () => {
 
    beforeAll(async () => {
        await app.ready()
    })
 
    afterAll(async() => {
        await app.close()
    })

    it('should be able to create a check-in', async() => {

        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'Javascript Academy',
                latitude: -23.564224,
                longitude: -46.653156,
            }
        })
 
        const response = await request(app.server)
         .post(`/gyms/${gym.id}/check-ins`)
         .set('Authorization', `Bearer ${token}`)
         .send({
            latitude: -23.564224,
            longitude: -46.653156,
         })
 

        expect(response.statusCode).toEqual(201)
    
        
    })
})