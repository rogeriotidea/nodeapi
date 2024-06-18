import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
 
    beforeAll(async () => {
        await app.ready()
    })
 
    afterAll(async() => {
        await app.close()
    })

    it('should be able to create a gym', async() => {

        const { token } = await createAndAuthenticateUser(app)
 
        const response = await request(app.server)
         .post('/gyms')
         .set('Authorization', `Bearer ${token}`)
         .send({
            title: "Academia do Rogerio",
            description: "Academia do lele",
            phone: "11992992922",
            latitude: -23.564224,
            longitude: -46.653156,
         })
 

        expect(response.statusCode).toEqual(201)
    
        
    })
})