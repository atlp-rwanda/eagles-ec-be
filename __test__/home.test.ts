import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import sequelize, { connect } from "../src/config/dbConnection";

describe("Testing Home route", () => {
  beforeAll(async () => {
    try {
      await connect();
    } catch (error) {
      sequelize.close();
    }
  }, 20000);

  test("server should return status code of 200 --> given'/'", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  }, 20000);
  test("server should return status code of 200 and link to log in with google --> given'/login'", async () => {
    const response = await request(app).get("/login");
    expect(response.text).toBe("<a href='/auth/google'>click to here to Login</a>")

    expect(response.status).toBe(200);
  }, 20000);
});
