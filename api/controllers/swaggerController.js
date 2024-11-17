import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerController = Router();

swaggerController.get("/swagger.json", (req, res) => {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Project Management API",
      version: "1.0.0",
      description: "API for managing projects, users, and authentication.",
    },
    paths: {
      "/api/developer/allClients": {
        get: {
          summary: "Fetch all clients",
          description: "Retrieve a list of all clients.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of clients",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/allDevelopers": {
        get: {
          summary: "Fetch all developers",
          description: "Retrieve a list of all developers.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of developers",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        skills: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/project/{projectId}": {
        get: {
          summary: "Fetch developers for a specific project",
          description:
            "Retrieve a list of developers associated with a project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "A list of developers for the project",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/assignProject": {
        post: {
          summary: "Assign a developer to a project",
          description: "Assign a developer to a specific project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    developerId: { type: "string" },
                    projectId: { type: "string" },
                  },
                  required: ["developerId", "projectId"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Developer assigned to the project",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      developer: { type: "object" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/developer/{developerId}/project/{projectId}": {
        delete: {
          summary: "Remove a developer from a project",
          description: "Remove a developer from a specific project.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "developerId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID of the developer",
            },
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "Developer removed from the project",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/login": {
        post: {
          summary: "User login",
          description: "Authenticate a user and return a token.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      token: { type: "string" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/projects": {
        get: {
          summary: "Fetch all projects",
          description: "Retrieve a list of all projects.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/projects/{projectId}": {
        get: {
          summary: "Fetch a project by ID",
          description: "Retrieve details of a specific project by ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "projectId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project",
            },
          ],
          responses: {
            200: {
              description: "Project details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      budget: { type: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/chat/history/{senderId}/{receiverId}": {
        get: {
          summary: "Fetch chat history",
          description: "Retrieve chat history between two users.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "senderId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the sender user",
            },
            {
              name: "receiverId",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the receiver user",
            },
          ],
          responses: {
            200: {
              description: "Chat history retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        senderId: { type: "integer" },
                        receiverId: { type: "integer" },
                        message: { type: "string" },
                        timestamp: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
  res.json(swaggerSpec);
});

swaggerController.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../others/swagger-ui.html"));
});

export default swaggerController;
