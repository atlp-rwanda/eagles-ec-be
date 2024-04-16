import request from "supertest";
import { beforeAll, afterAll, jest, test } from "@jest/globals";
import app from "../src/utils/server";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(`${process.env.TEST_DB}`, {
  dialect: "postgres",
});

describe("Testing Home route", () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error("failed to connect to db");
    }
  }, 20000);

  afterAll(async () => {
    await sequelize.close();
  });

  test("servr should return status code of 200 --> given'/'", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  }, 20000);
});
