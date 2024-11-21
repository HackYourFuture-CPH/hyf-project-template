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
      title: "YAR Solutions Project Management API",
      version: "1.0.0",
      description: "API for managing projects, users, and authentication.",
    },
    paths: {
      "/api/projects/create": {
        post: {
          summary: "Create a new project",
          description: "Create a new project with the specified details.",
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
                    title: { type: "string" },
                    description: { type: "string" },
                    budget: { type: "number" },
                  },
                  required: ["title", "description", "budget"],
                },
                example: {
                  title: "New Project tester",
                  description: "Project description",
                  budget: 15000,
                },
              },
            },
          },
          responses: {
            201: {
              description: "Project created successfully",
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
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/users": {
        get: {
          summary: "Fetch all users",
          description: "Retrieve a list of all users.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "A list of users",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        email: { type: "string" },
                        role: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          summary: "Fetch user by ID",
          description: "Retrieve details of a specific user by their ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the user",
            },
          ],
          responses: {
            200: {
              description: "User details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "integer" },
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                },
              },
            },
            404: { description: "User not found" },
          },
        },
      },
      "/api/user": {
        get: {
          summary: "Fetch user email and role",
          description:
            "Fetch the user's email and role based on the provided token.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          responses: {
            200: {
              description: "User details retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                  example: {
                    email: "user@example.com",
                    role: "Client",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
                  },
                },
              },
            },
          },
        },
      },
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
      "/api/chat/send": {
        post: {
          summary: "Send a chat message",
          description: "Sends a chat message from one user to another.",
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
                    senderId: {
                      type: "integer",
                      description: "ID of the sender",
                    },
                    receiverId: {
                      type: "integer",
                      description: "ID of the receiver",
                    },
                    message: {
                      type: "string",
                      description: "The message content",
                    },
                  },
                  required: ["senderId", "receiverId", "message"],
                },
                example: {
                  senderId: 8,
                  receiverId: 9,
                  message: "This is a test message",
                },
              },
            },
          },
          responses: {
            200: {
              description: "Message sent successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      messageId: { type: "integer" },
                    },
                  },
                  example: {
                    success: true,
                    messageId: 123,
                  },
                },
              },
            },
            400: {
              description: "Bad Request - Missing or invalid fields",
              content: {
                "application/json": {
                  example: {
                    error: "Message content cannot be empty",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
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
      "/api/projects/{id}": {
        delete: {
          summary: "Delete a project by ID",
          description:
            "Deletes a specific project based on the provided project ID.",
          security: [
            {
              BearerAuth: [],
            },
          ],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
              description: "ID of the project to delete",
            },
          ],
          responses: {
            200: {
              description: "Project deleted successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                    },
                  },
                  example: {
                    message: "Project deleted successfully",
                  },
                },
              },
            },
            404: {
              description: "Project not found",
              content: {
                "application/json": {
                  example: {
                    error: "Project not found",
                  },
                },
              },
            },
            401: {
              description: "Unauthorized - Invalid or missing token",
              content: {
                "application/json": {
                  example: {
                    error: "jwt must be provided",
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
