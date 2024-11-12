import request from "supertest";
import app from "./src/index.js";
import { describe, it, expect, beforeAll, afterAll, jest } from "@jest/globals"; // Remove jest import
import http from "http";

jest.mock("./controllers/swaggerController.js", () => {
  return function (req, res) {
    res.send("Swagger documentation mock");
  };
});

// jest.mock("./config/db.js", () => ({
//   connect: jest.fn().mockResolvedValue("mocked connection"),
//   default: {
//     define: jest.fn().mockReturnValue({
//       init: jest.fn(), // Mocking init method
//       sync: jest.fn().mockResolvedValue("mocked sync"), // Mock sync method
//     }),
//   },
// }));

// jest.mock("./models/user.js", () => ({
//   sync: jest.fn().mockResolvedValue("mocked sync"),
// }));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3002, done);
});
jest.setTimeout(20000);
afterAll((done) => {
  server.close(done);
});

describe("Project API Endpoints", () => {
  // let projectId;

  it("should retrieve all projects", async () => {
    const response = await request(server).get("/api/pj/").expect(200);
    expect(Array.isArray(response.body)).toBe(true);
  }, 20000);

  // it("should retrieve a project by ID", async () => {
  //   const response = await request(server)
  //     .get(`/api/pj/${projectId}`)
  //     .expect(200);

  //   expect(response.body).toHaveProperty("id", projectId);
  // }, 20000);
});
