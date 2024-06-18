import request from 'supertest'
import { app } from '../../../app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
 
    beforeAll(async () => {
        await app.ready()
    })
  
    afterAll(async() => {
        await app.close()
    }) 

    it('should be able to search gyms by title', async() => {
 
        const { token } = await createAndAuthenticateUser(app)
 
        await request(app.server)
         .post('/gyms')
         .set('Authorization', `Bearer ${token}`)
         .send({
            title: "Academia do Rogerio",
            description: "Academia do lele",
            phone: "11992992922",
            latitude: -23.564224,
            longitude: -46.653156,
         })
    
         const response = await request(app.server)
         .get('/gyms/search')
         .query({
            q: 'Academia'
         })
         .set('Authorization', `Bearer ${token}`)
         .send()

         
          expect(response.statusCode).toEqual(200)
          expect(response.body.gyms).toHaveLength(1)
          expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Academia do Rogerio',
            })
         ])
    
        
    })
})