import request from "supertest"
import { beforeAll, afterAll, jest, test } from "@jest/globals"
import app from "../src/utils/server"
import { testDbConnection, testSequelize } from "../src/config/testDbConfig"

describe("Testing Home route", () => {
  beforeAll(async () => {
    try {
      await testDbConnection()
    } catch (error) {
      testSequelize.close()
    }
  }, 20000)

  test("server should return status code of 200 --> given / ", async () => {
    const response = await request(app).get("/")

    expect(response.status).toBe(200)
  }, 20000)
})
