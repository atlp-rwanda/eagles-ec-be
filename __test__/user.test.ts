import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/users";
import { Role } from "../src/sequelize/models/roles";
import bcrypt from "bcrypt"
import * as userServices from "../src/services/user.service";
import * as mailServices from "../src/services/mail.service";
import sequelize, { connect } from "../src/config/dbConnection";
import { response } from "express";

const userData: any = {
  name: "yvanna5",
  username: "testuser5",
  email: "test15@gmail.com",
  password: "test12345",
};
const dummyAdmin ={
  email: "dummyAdmin@example.com",
  password: "password"
}



const dummySeller = {
  name: "dummy1234",
  username: "username1234",
  email: "soleilcyber00@gmail.com",
  password: "1234567890",
};
const userTestData = {
  newPassword: "Test@123",
  confirmPassword: "Test@123",
  wrongPassword: "Test456",
};

const loginData: any = {
  email: "test1@gmail.com",
  password: "test1234",
};

let admintoken: any;
describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
      await connect();
      const dummy = await request(app).post("/api/v1/users/register").send(dummySeller);
    } catch (error) {
      throw error;
      sequelize.close();
    }
  }, 40000);

  afterAll(async () => {
    await User.destroy({ truncate: true });
    await sequelize.close();
  }, 20000);

  let token: any;
  
  let dummySellerId: number;


  describe("Testing user authentication", () => {
    test("should return 201 and create a new user when registering successfully", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(201);
    }, 20000);

    test("should create test Admin and test roles", async()=>{
      const testRole =
        [
          {
            
            name: "buyer",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "seller",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ];

        let testRoles = await Role.bulkCreate(testRole)
      
      const testAdmin ={
        name: "testAdmin",
        username: "testAdmin",
        email: "testAdmin@example.com",
        password: await bcrypt.hash("password", 10),
        roleId: 3
      }
      let testAd = await  User.create(testAdmin)
      
    })

    test("should login a dummyadmin", async() =>{
      const response = await request(app).post("/api/v1/users/login").send({
        email: "testAdmin@example.com",
        password: "password"
      })
      
      expect(response.body.message).toBe("Logged in")
      admintoken = response.body.token
    })

    test("should return 409 when registering with an existing email", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(409);
    }, 20000);

    test("should return 400 when registering with an invalid credential", async () => {
      const userData = {
        email: "test@mail.com",
        name: "",
        username: "existinguser",
      };
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);

      expect(response.status).toBe(400);
    }, 20000);
  });

  describe('Role Update Endpoint', () => {
    test('It should create a Role', async () => {
        const res = await request(app)
  
            .post('/api/v1/roles')
            .send({
            name: 'testRole', 
            })
            .set('Authorization', `Bearer ${admintoken}`);
    });
    test('It should get all roles', async () => {
        const res = await request(app);
        res.get('/api/v1/roles')
    .expect(200)
        
    })
  
    test('It should require authorization', async () => {
      const res = await request(app)
        .patch('/api/v1/roles/2')
        .send({
          name: 'admin',
        });
        
      expect(res.statusCode).toEqual(401);
    });
    test('It should update a role', async () => {
      const res = await request(app)
        .patch('/api/v1/roles/1')
        .send({
          name: 'testRole',
        })
        .set('Authorization', `Bearer ${admintoken}`);
        
      expect(res.body).toHaveProperty('message');
    });    
     
  
    
  });

  test("should return all users in db --> given '/api/v1/users'", async () => {
    const spy = jest.spyOn(User, "findAll");
    const spy2 = jest.spyOn(userServices, "getAllUsers");
    const response = await request(app).get("/api/v1/users");
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  }, 20000);

  test("Should return status 401 to indicate Unauthorized user", async () => {
    const loggedInUser = {
      email: userData.email,
      password: "test123456",
    };
    const spyonOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      //@ts-ignore
      email: userData.email,
      password: loginData.password,
    });
    const response = await request(app).post("/api/v1/users/login").send(loggedInUser);
    expect(response.body.status).toBe(401);
    spyonOne.mockRestore();
  }, 20000);
  test("should login a dummy seller", async()=>{
    const response  = await request(app).post("/api/v1/users/login").send({
      email: dummySeller.email,
      password: dummySeller.password
    })
    expect(response.status).toBe(200);
    dummySellerId = response.body.user.id;
  })

  test("should update dummyseller role from default to a seller", async() =>{
    
    const response  = await request(app).patch(`/api/v1/users/${dummySellerId}/role`).send(
      {
        roleId: 2
      }

    )
    .set("Authorization", "Bearer " + admintoken);
    expect(response.status).toBe(200)
  })

  test("Should send otp verification code", async () => {
    const spy = jest.spyOn(mailServices, "sendEmailService");
    const response = await request(app).post("/api/v1/users/login").send({
      email: dummySeller.email,
      password: dummySeller.password,
    });

    expect(response.body.message).toBe("OTP verification code has been sent ,please use it to verify that it was you");
    // expect(spy).toHaveBeenCalled();
  }, 40000);
  

 

  test("should log a user in to retrieve a token", async () => {
    const response = await request(app).post("/api/v1/users/login").send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toBe(200);
    token = response.body.token;
  });

  test("should return 400 when adding an extra field while updating password", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.confirmPassword,
        role: "seller",
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });

  test("should return 401 when updating password without authorization", async () => {
    const response = await request(app).put("/api/v1/users/passwordupdate").send({
      oldPassword: userData.password,
      newPassword: userTestData.newPassword,
      confirmPassword: userTestData.confirmPassword,
    });
    expect(response.status).toBe(401);
  });

  test("should return 200 when password is updated", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.confirmPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(200);
  });

  test("should return 400 when confirm password and new password doesn't match", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userData.password,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.wrongPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });

  test("should return 400 when old password is incorrect", async () => {
    const response = await request(app)
      .put("/api/v1/users/passwordupdate")
      .send({
        oldPassword: userTestData.wrongPassword,
        newPassword: userTestData.newPassword,
        confirmPassword: userTestData.wrongPassword,
      })
      .set("Authorization", "Bearer " + token);
    expect(response.status).toBe(400);
  });
});

describe("Testing user authentication", () => {
  test("should return 200 when password is updated", async () => {
    const response = await request(app)
      .get("/login")
      expect(response.status).toBe(200) 
      expect(response.text).toBe('<a href="/api/v1/users/auth/google"> Click to  Login </a>')
  });
  test("should return a redirect to Google OAuth when accessing /auth/google", async () => {
    const response = await request(app).get("/api/v1/users/auth/google");
    expect(response.status).toBe(302);
    expect(response.headers.location).toContain("https://accounts.google.com/o/oauth2");
  });

  test("should handle Google OAuth callback and redirect user appropriately", async () => {
    const callbackFnMock = jest.fn();
  
    const response = await request(app).get("/api/v1/users/auth/google/callback");
    expect(response.status).toBe(302); 
  });
  
});



