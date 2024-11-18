const supertest = require("supertest");
const { describe, it, before } = require("mocha");

let chai;

(async () => {
  chai = await import("chai");
})();

const config = {
  assertionFormat: "chai",
  request: {
    baseURL: "http://localhost:3001",
    headers: {},
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

describe("Manual API Tests", () => {
  it("/api/developer/allClients => should fetch all clients", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/developer/allClients")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/allDevelopers => should fetch all developers", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/developer/allDevelopers")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/project/{projectId} => should fetch developers for a specific project", async () => {
    const projectId = 5;
    const response = await supertest(config.request.baseURL)
      .get(`/api/developer/project/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/developer/assignProject => should assign a developer to a project", async () => {
    const requestBody = {
      projectId: "2",
      developerId: "8",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/developer/assignProject")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/dev/{developerId}/project/{projectId} => should remove a developer from a project", async () => {
    const developerId = "8";
    const projectId = "2";
    const response = await supertest(config.request.baseURL)
      .delete(`/api/developer/${developerId}/project/${projectId}`)
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
    const userId = "8";
    const response = await supertest(config.request.baseURL)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects => should fetch all projects", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/{id} => should fetch a specific project by ID", async () => {
    const projectId = "2";
    const response = await supertest(config.request.baseURL)
      .get(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  it("/api/projects/create => should create a new project", async () => {
    const requestBody = {
      title: "New Project tester",
      description: "Project description",
      budget: "15000",
    };
    const response = await supertest(config.request.baseURL)
      .post("/api/projects/create")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);
    chai.expect(response.status).to.equal(201);
  });

  it("/api/user => should fetch an user email and role based only in the token", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/user")
      .send({ token })
      .set("Authorization", `Bearer ${token}`);

    console.log(response.body);

    chai.expect(response.status).to.equal(200);
  });

  it("/api/chat/send => should send a chat message", async () => {
    const requestBody = {
      senderId: 8,
      receiverId: 9,
      message: "This is a test message",
    };

    const response = await supertest(config.request.baseURL)
      .post("/api/chat/send")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    chai.expect(response.status).to.equal(200);
  });

  it("/api/chat/history/8/9 => should fetch chat history", async () => {
    const response = await supertest(config.request.baseURL)
      .get("/api/chat/history/8/9")
      .set("Authorization", `Bearer ${token}`);
    chai.expect(response.status).to.equal(200);
  });

  //  it("/api/projects/{id} (DELETE) => should delete a project by ID", async () => {
  //   const projectId = "7";
  //   const response = await supertest(config.request.baseURL)
  //     .delete(`/api/projects/${projectId}`)
  //     .set("Authorization", `Bearer ${token}`);
  //   chai.expect(response.status).to.equal(200);
  // });
});
