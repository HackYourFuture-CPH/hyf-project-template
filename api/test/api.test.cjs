//const { testGen } = require("swagger-test-templates");
//const path = require("path");
const supertest = require("supertest");
const { describe, it, before } = require("mocha");

let chai;

// Dynamically import Chai since it's an ES module
(async () => {
  chai = await import("chai");
})();

// Swagger JSON URL from your server
//const apiSpecPath = "http://localhost:3001/docs/swagger.json";

const config = {
  assertionFormat: "chai",
  request: {
    baseURL: "http://localhost:3001", // Base URL for your API
    headers: {}, // Will include Authorization dynamically
  },
};

let token;

before(async () => {
  const response = await supertest(config.request.baseURL)
    .post("/api/login")
    .send({
      email: "ale@ale.com",
      password: "ale",
    });

  token = response.body.token;
  if (!token) {
    throw new Error("Failed to fetch auth token. Check login credentials.");
  }

  config.request.headers.Authorization = `Bearer ${token}`;
});

// Generate tests based on Swagger template
// const tests = testGen(apiSpecPath, config);

// // Debug: Log generated tests to verify if they exist
// console.log("Generated Tests:", tests);

// if (tests.length === 0) {
//   console.error(
//     "No tests were generated. Check your Swagger JSON and configuration."
//   );
// }

// // Execute generated tests
// tests.forEach(({ name, scenarios }) => {
//   describe(name, () => {
//     scenarios.forEach(({ name: scenarioName, test }) => {
//       it(scenarioName, (done) => {
//         test(supertest, chai.expect, done);
//       });
//     });
//   });
// });

// Manual test as a fallback to ensure the API works
describe("Manual API Tests", () => {
  it("/api/dev/allClients => should fetch all clients", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/dev/allClients")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/dev/allDevelopers => should fetch all developers", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/dev/allDevelopers")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/dev/project/{PJid} => should fetch developers for a specific project", async () => {
    const project_id = 5;
    const response = await supertest(config.request.baseURL)
      .get(`/api/dev/project/${project_id}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/dev/assign => should assign a developer to a project", async () => {
    const requestBody = {
      project_id: "2",
      developer_id: "8",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/dev/assign")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/dev/{DEVid}/project/{PJid} => should remove a developer from a project", async () => {
    const developer_id = "8";
    const project_id = "2";
    const response = await supertest(config.request.baseURL)
      .delete(`/api/dev/${developer_id}/project/${project_id}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/login => should return 200 for valid login", async () => {
    const response = await supertest(config.request.baseURL)
      .post("/api/login")
      .send({
        email: "ale@ale.com",
        password: "ale",
      });
    chai.expect(response.status).to.equal(200);
    chai.expect(response.body.success).to.equal(true);
  });

  it("/api/users => should fetch all users", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/users/{id} => should fetch a specific user by ID", async () => {
    const user_id = "8";
    const response = await supertest(config.request.baseURL)
      .get(`/api/users/${user_id}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/pj => should fetch all projects", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/pj")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/pj/{id} => should fetch a specific project by ID", async () => {
    const project_id = "2";
    const response = await supertest(config.request.baseURL)
      .get(`/api/pj/${project_id}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/pj/create => should create a new project", async () => {
    const requestBody = {
      title: "New Project test",
      description: "Project description",
      budget: "15000",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/pj/create")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(201);
  });

  // it("/api/pj/{id} (DELETE) => should delete a project by ID", async () => {
  //   const projectId = "7";
  //   const response = await supertest(config.request.baseURL)
  //     .delete(`/api/pj/${projectId}`)
  //     .set("Authorization", `Bearer ${token}`);
  //   chai.expect(response.status).to.equal(200);
  // });
});
