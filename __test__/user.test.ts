import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import User from "../src/sequelize/models/users";
import * as userServices from "../src/services/user.service";
import sequelize, { connect } from "../src/config/dbConnection";
const userData: any = {
  name: "yvanna",
  username: "testuser",
  email: "test1@gmail.com",
  password: "test1234",
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
describe("Testing user Routes", () => {
  beforeAll(async () => {
    try {
      await connect();
      await User.destroy({ truncate: true });
    } catch (error) {
      sequelize.close();
    }
  }, 40000);

  afterAll(async () => {
    await User.destroy({ truncate: true });
    await sequelize.close();
  });
  let token: any;
  describe("Testing user authentication", () => {
    test("should return 201 and create a new user when registering successfully", async () => {
      const response = await request(app)
        .post("/api/v1/users/register")
        .send(userData);
      expect(response.status).toBe(201);
    }, 20000);

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
      password: "test",
    };
    const spyonOne = jest.spyOn(User, "findOne").mockResolvedValueOnce({
      //@ts-ignore
      email: userData.email,
      password: loginData.password,
    });
    const response = await request(app)
      .post("/api/v1/users/login")
      .send(loggedInUser);
    expect(response.body.status).toBe(401);
    spyonOne.mockRestore();
  });
})


describe("Testing Google auth", () => {
  test('It should return Google login page with redirect status code (302), correct headers,', async () => {
    const response = await request(app).get('/api/v1/users/login/google');
    expect(response.status).toBe(302);
    expect(response.headers).toHaveProperty('location');
  }, 20000);

  test('Callback endpoint should redirect to success route after successful authentication', async () => {
    const response = await request(app).get('/api/v1/users/auth/google/callback');
    expect(response.status).toBe(302); 
    expect(response.header['location']).toContain("redirect_uri");
  });

});