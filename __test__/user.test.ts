import request from "supertest";
import { mocked } from "jest-mock";
import { beforeAll, beforeEach, afterEach, afterAll, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/users";
import * as userServices from "../src/services/user.service";
import * as mailServices from "../src/services/mail.service";
import sequelize, { connect } from "../src/config/dbConnection";
// import * as twoFAService from "../src/utils/2fa";
import { profile } from "console";
import bcrypt from "bcryptjs";
import { roleService } from "../src/services/role.service";
import { Role } from "../src/sequelize/models/roles";
import exp from "constants";
import { QueryTypes } from "sequelize";
// import redisClient from "../src/config/redis";
import Redis from "ioredis";
import { env } from "../src/utils/env";
import { generateResetToken, generateVerificationToken } from "../src/utils/generateResetToken";

let redisClient: any;

jest.mock("../src/services/mail.service", () => ({
  sendEmailService: jest.fn(),
  sendNotification: jest.fn(),
}));


const userData: any = {
  name: "yvanna5",
  username: "testuser5",
  email: "test15@gmail.com",
  password: "test12345",
  lastPasswordUpdateTime: new Date()
};

const dummySeller = {
  name: "dummy1234",
  username: "username1234",
  email: "srukundo01@gmail.com",
  password: "1234567890",
  lastPasswordUpdateTime: "3000, 11, 18"
};
const userTestData = {
  newPassword: "Test@123",
  isVerified:true,
  confirmPassword: "Test@123",
  wrongPassword: "Test456",
};

const loginData: any = {
  email: "test1@gmail.com",
  password: "test1234",
};
 
const updateData:any = { 
  // @ts-ignore
  userId: userData.id,
  profileImage: "",
  fullName: "Patrick alex", 
  email: userData.email,
  gender: "", 
  birthdate: "", 
  preferredLanguage: "", 
  preferredCurrency: "", 
  street: "",
  city: "",
  state: "",
  postalCode:"",
  country: "Rwanda",
 }
 
 jest.mock('../src/jobs/isPasswordExpired');
 
describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
       redisClient = new Redis(env.redis_url);
      await connect();
      await sequelize.query('TRUNCATE TABLE profiles, users CASCADE');
      const testAdmin = {
        name: "admin",
        username: "admin",
        email: "admin1@example.com",
        password: await bcrypt.hash("password", 10),
        roleId: 3
      }
   
      await Role.destroy({ where: {}});
      const resetId = await sequelize.query('ALTER SEQUENCE "Roles_id_seq" RESTART WITH 1');
      
      await Role.bulkCreate([
        { name: "buyer" },
        { name: "seller" },
        { name: "admin" },
      ])
     
      await User.create(testAdmin);
  
      const dummy = await request(app).post("/api/v1/users/register").send(dummySeller);
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }, 40000);


  let token:any;
  let adminToken:any;
  let registerdUserId:any;
  describe("Testing user authentication", () => {
    test("should return 201 and create a new user when registering successfully", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(201);
    }, 20000);

    it("It should verify user account.",async()=>{
      const token = generateVerificationToken(userData.email, 60);
      const response = await request(app)
                      .get(`/api/v1/users/verify-user?token=${token}`)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('User verified successfully.')
    },60000)


    test("should return 409 when registering with an existing email", async () => {
      User.create(userData);
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

    test("should return token to log in", async () => {
      const response = await request(app)
      .post("/api/v1/users/login").send({
        email: userData.email,
        password: userData.password,
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Logged in");
      token = response.body.token;
    });
    
    test('should return 200 and the user profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(200);
   })

    test('should return 401 when user not logged in', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .set("Authorization", "Bearer " );
  
      expect(response.status).toBe(401);
   })
    test('should return 200 when user updated his profile', async () => {
      const response = await request(app)
        .get('/api/v1/users/profile') 
        .send(updateData)
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(200);
   })

    test('should return 400 when user update empty profile', async () => {
      const response = await request(app)
        .patch('/api/v1/users/profile') 
        .send({})
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(400);
   })
    test('should return 400 when user update email', async () => {
      const response = await request(app)
        .patch('/api/v1/users/profile') 
        .send({email: "nyvan@gmail.com"})
        .set("Authorization", "Bearer " + token);
  
      expect(response.status).toBe(400);
   })
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
  it("It should verify user account.",async()=>{
    const token = generateVerificationToken('admin1@example.com', 60);
    const response = await request(app)
                    .get(`/api/v1/users/verify-user?token=${token}`)
          expect(response.status).toBe(200)
          expect(response.body.message).toBe('User verified successfully.')
  },60000)

  test("should login an Admin", async () =>{
    const response = await request(app).post("/api/v1/users/login").send({
      email: "admin1@example.com",
      password: "password"
  })
  adminToken = response.body.token;
});
    it("It should verify user account.",async()=>{
      const token = generateVerificationToken(dummySeller.email, 60);
      const response = await request(app)
                      .get(`/api/v1/users/verify-user?token=${token}`)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe('User verified successfully.')
    },60000)

    test("should return 200 when all roles are fetched", async () => {
      const response = await request(app)
        .get("/api/v1/roles").set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
    });
    test("should return all users in db --> given '/api/v1/users'", async () => {
      const spy = jest.spyOn(User, "findAll");
      const spy2 = jest.spyOn(userServices, "getAllUsers");
      const response = await request(app).get("/api/v1/users").set('Authorization', `Bearer ${adminToken}`);;
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    }, 20000);
  
  test("should update dummyseller's role to seller", async () => {
    const logDummySeller = await request(app).post("/api/v1/users/login").send({
      email: dummySeller.email,
      password: dummySeller.password,
    });
    expect(logDummySeller.status).toBe(200);
    expect(logDummySeller.body.message).toBe("Logged in");
    const seller = await userServices.getUserByEmail(dummySeller.email);
    const dummySellerId = seller?.id;

    const response = await request(app)
      .patch(`/api/v1/users/${dummySellerId}/role`)
      .send({
        roleId: 2,
      })
      .set("Authorization", "Bearer " + adminToken);
    
    expect(response.status).toBe(200);
    // expect(response.body.message).toBe('User role updated successfully');
    
  });

    test("Should send otp verification code", async () => {
    jest.unmock("../src/services/mail.service");
    const originalMailService = jest.requireActual("../src/services/mail.service");
    const spy = jest.spyOn(mailServices, "sendEmailService");
    const response = await request(app).post("/api/v1/users/login").send({
      email: dummySeller.email,
      password: dummySeller.password,
    });

      expect(response.body.message).toBe("OTP verification code has been sent ,please use it to verify that it was you");
      expect(spy).toHaveBeenCalled()
    jest.mock("../src/services/mail.service", () => ({
      sendEmailService: jest.fn(),
      sendNotification: jest.fn(),
    }));
  }, 70000);

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


  
})
describe('updateUserAccountStatus', () => {

  it('should return 401 when user is not logged in', async () => {
    const response = await request(app)
      .patch('/api/v1/users/123/status');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('You are not logged in. Please login to continue.');
  });

  it('should return 200 when user account status is updated', async () => {
    const query = `
      SELECT id
      FROM users
      WHERE email = :email
    `;
    const [userIdData] = await sequelize.query(query, {
      replacements: { email: userData.email },
      type: QueryTypes.SELECT,
    },);
// @ts-ignore
    if (userIdData && userIdData.id) {
      // @ts-ignore
      const userId = userIdData.id;
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/status`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User account status updated successfully');
    } else {
      throw new Error('User not found');
    }
  }, 40000);

  it('should return 404 when user does not exist', async () => {
  
      const userId = 99999999;
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/status`)
        .set('Authorization', `Bearer ${adminToken}`);
        expect(response.status).toBe(404);
        expect(response.body.data.message).toBe('User not found');
    
  }, 10000);
  it('should return 403 when  you are not an admin', async () => {
    const query = `
      SELECT id
      FROM users
      WHERE email = :email
    `;
    const [userIdData] = await sequelize.query(query, {
      replacements: { email: userData.email },
      type: QueryTypes.SELECT,
    });
// @ts-ignore
    if (userIdData && userIdData.id) {
      // @ts-ignore
      const userId = userIdData.id;
      const response = await request(app)
        .patch(`/api/v1/users/${userId}/status`)
        .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Only admins can perform this action');
    } else {
      throw new Error('User not found');
    }
  });
});

describe("Admin should be able to CRUD roles", () => {
  let testRoleName = "testrole";
  let newRoleId: any;
  test("should return 201 when a new role is created", async () => {
    const response = await request(app)
      .post("/api/v1/roles")
      .send({
        name: testRoleName,
      })
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(201);
    newRoleId = response.body.role.id;
   
  });

  test("should return 400 when a role with the same name is created", async () => {
    const response = await request(app)
      .post("/api/v1/roles")
      .send({
        name: testRoleName,
      })
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(400);
  });

  test("should return 404 when deleting a role which doesn't exist", async () => {
    const response = await request(app)
      .delete("/api/v1/roles/1000")
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(404);
  })
  test("should return 200 when a role is updated", async () => {
    const response = await request(app)
      .patch("/api/v1/roles/" + newRoleId)
      .send({
        name: "testRoled",
      })
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200);
  });
  test("should return 400 role already exists when a role is updated with an existing name", async () => {
    const response = await request(app)
      .patch("/api/v1/roles/" + newRoleId)
      .send({
        name: "buyer"
      })
      .set("Authorization", "Bearer " + adminToken);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Role already exists')
  });

  test("should return 401 Unauthorized when trying to create or update role without Auth", async () =>{
    const response = await request(app)
      .patch("/api/v1/roles/" + newRoleId)
      .send({
        name: "testRoled",
      })
    expect(response.status).toBe(401);
  })

  test("should return 200 when a role is deleted", async () => {
    const response = await request(app)
      .delete("/api/v1/roles/" + newRoleId)
      .set("Authorization", "Bearer " + adminToken);
    expect(response.status).toBe(200);
  });
});

test("should return 409 when updating a role for user who doesn't exist", async () => {

  const response = await request(app)
    .patch("/api/v1/users/1000/role")
    .send({
      roleId: 2,
    })
    .set("Authorization", "Bearer " + adminToken);
   
    
  expect(response.status).toBe(409);
});

test("should return 409 when updating a role for a role that doesn't exist", async () => {
  const response = await request(app)
    .patch("/api/v1/users/1/role")
    .send({
      roleId: 1000,
    })
    .set("Authorization", "Bearer " + adminToken);
  expect(response.status).toBe(409);
});

test("should logout a user", async () => {
  const response = await request(app)
  .post("/api/v1/users/logout")
  .set("Authorization", "Bearer " + token);
  expect(response.status).toBe(200);
})
})
describe('POST /send-reset-email', () => {
  it('should send a reset email', async () => {
      const response = await request(app)
          .post('/api/v1/users/password-reset-link')
          .send({ email:dummySeller.email });
      expect(response.status).toBe(200);
      expect(response.body.message).toEqual("Password reset link sent to your email.");
  },6000);
  it('should send return 404 if user not found', async () => {
      const response = await request(app)
          .post('/api/v1/users/password-reset-link')
          .send({ email:'unknown@emailValidation.com'});
      expect(response.body.status).toBe(404);
      expect(response.body.message).toEqual('User not found.');
  },60000);
});
describe('Patch /api/v1/users/reset-password', () => {
    it('should return 200 if reset password request is successful', async () => {
      const token = generateResetToken(dummySeller.email, 60);
        const requestBody = {
            token,
            password: 'newPassword',
            confirmPassword: 'newPassword'
        };
        const response = await request(app)
            .patch('/api/v1/users/reset-password')
            .send(requestBody);
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Password updated successfully.")
    }, 60000);

    it('should return 400 if invalid token is provided', async () => {
      const requestBody = {
          token: 'invalid-token',
          password: 'newPassword',
          confirmPassword: 'newPassword'
      };
      const response = await request(app)
          .patch('/api/v1/users/reset-password')
          .send(requestBody);
      expect(response.status).toBe(400);
  },60000);
});

describe("Verifying user account",()=>{
  it("It should verify user account.",async()=>{
    await User.create(userData)
    const token = generateVerificationToken(userData.email, 60);
    const response = await request(app)
                    .get(`/api/v1/users/verify-user?token=${token}`)
          expect(response.status).toBe(200)
          expect(response.body.message).toBe('User verified successfully.')
  },60000)

  it("It should send a verification link.",async()=>{
    const response = await request(app)
                    .post('/api/v1/users/verify-user-email')
                    .send({
                      email:userData.email
                    })
          expect(response.status).toBe(409)
          expect(response.body.message).toBe("User is already verified.")
  },60000)

})



afterAll(async () => {
  try {
    await sequelize.query('TRUNCATE TABLE profiles, users CASCADE');
  } catch (error) {
    console.error('Error truncating tables:', error);
  } finally {
    try {
      await redisClient.quit()
      await sequelize.close();
    } catch (error) {
      console.error('Error closing the database connection:', error);
    }
  }
});

