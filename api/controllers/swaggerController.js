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
      "/api/dev/allClients": {
        get: {
          summary: "Get all clients",
          description: "Fetches a list of all clients.",
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
      "/api/dev/allDevelopers": {
        get: {
          summary: "Get all developers",
          description: "Fetches a list of all developers.",
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
      "/api/dev/project/{PJid}": {
        get: {
          summary: "Get developers of a specific project",
          description: "Fetches developers associated with a specific project.",
          parameters: [
            {
              name: "PJid",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
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
      "/api/dev/assign": {
        post: {
          summary: "Assign a developer to a project",
          description: "Assigns a developer to a specific project.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    developerId: {
                      type: "string",
                      description: "ID of the developer",
                    },
                    projectId: {
                      type: "string",
                      description: "ID of the project",
                    },
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
      "/api/dev/{DEVid}/project/{PJid}": {
        delete: {
          summary: "Remove a developer from a project",
          description: "Removes a developer from a specific project.",
          parameters: [
            {
              name: "DEVid",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
              description: "ID of the developer",
            },
            {
              name: "PJid",
              in: "path",
              required: true,
              schema: {
                type: "string",
              },
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
      // Authentication
      "/api/login": {
        post: {
          summary: "User login",
          operationId: "login",
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
                      message: { type: "string" },
                      redirectUrl: { type: "string" },
                      user: {
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
            400: { description: "Invalid input" },
            401: { description: "Unauthorized" },
          },
        },
      },
      "/api/logout": {
        post: {
          summary: "User logout",
          operationId: "logout",
          responses: {
            200: {
              description: "Logged out successfully",
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

      // User Management
      "/api/users": {
        get: {
          summary: "Get all users",
          operationId: "getUsers",
          responses: {
            200: {
              description: "List of users",
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
        post: {
          summary: "Create a new user",
          operationId: "createUser",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string" },
                  },
                  required: ["email", "password", "role"],
                },
              },
            },
          },
          responses: {
            201: { description: "User created successfully" },
            400: { description: "Invalid input" },
          },
        },
      },
      "/api/users/{id}": {
        get: {
          summary: "Get user by ID",
          operationId: "getUserById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "User found" },
            404: { description: "User not found" },
          },
        },
      },

      // Role-Based Access
      "/api/dashboard/dev": {
        get: {
          summary: "Access Developer dashboard",
          operationId: "getDeveloperDashboard",
          responses: {
            200: { description: "Developer dashboard content" },
            403: { description: "Access denied" },
          },
        },
      },
      "/api/dashboard/client": {
        get: {
          summary: "Access Client dashboard",
          operationId: "getClientDashboard",
          responses: {
            200: { description: "Client dashboard content" },
            403: { description: "Access denied" },
          },
        },
      },

      // Project Management
      "/api/pj": {
        get: {
          summary: "Get all projects",
          operationId: "getAllProjects",
          responses: {
            200: { description: "List of all projects" },
            500: { description: "Internal server error" },
          },
        },
      },
      "/api/pj/{id}": {
        get: {
          summary: "Get a project by ID",
          operationId: "getProjectById",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Project found" },
            404: { description: "Project not found" },
          },
        },
        post: {
          summary: "Update an existing project",
          operationId: "updateProject",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Project updated successfully" },
            404: { description: "Project not found" },
          },
        },
        delete: {
          summary: "Delete a project by ID",
          operationId: "deleteProject",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: { description: "Project deleted successfully" },
            404: { description: "Project not found" },
          },
        },
      },
      "/api/pj/create": {
        post: {
          summary: "Create a new project",
          operationId: "createProject",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                  required: ["name", "description"],
                },
              },
            },
          },
          responses: {
            201: { description: "Project created successfully" },
            400: { description: "Invalid input" },
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
