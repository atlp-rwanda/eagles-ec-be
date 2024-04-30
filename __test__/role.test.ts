import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import sequelize, { connect } from "../src/config/dbConnection";



describe('Role Update Endpoint', () => {
    beforeAll(async () => {
      await sequelize.sync();
    });
    let token = '';
    

    test('It should login a created User', async () => {
        const res = await request(app)
            .post('/api/v1/users/login')
            .send({
            email: 'test12@gmail.com',
            password: 'test1234',
            });
        token = res.body.token;
    });
    test('It should get all users', async () => {
        const res = await request(app);
        res.get('/api/v1/users')
        
    })

    test('It should require authorization', async () => {
      const res = await request(app)
        .patch('/api/v1/users/15/role')
        .send({
          role: 'admin',
        });
  
      expect(res.statusCode).toEqual(401);
    });
    
     
     
    
     
  
    
  });