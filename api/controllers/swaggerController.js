import { Router } from "express";
// import express from "express";
// import swaggerUi from "swagger-ui-dist";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerController = Router();

// swaggerController.use("/api-docs", express.static(swaggerUi.absolutePath()));

swaggerController.get("/swagger.json", (req, res) => {
  const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "Project Management API",
      version: "1.0.0",
      description: "API for managing projects in the system.",
    },
    paths: {
      "/api/pj": {
        get: {
          summary: "Get all projects",
          operationId: "getAllProjects",
          responses: {
            200: {
              description: "List of all projects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: {
                          type: "integer",
                          description: "The ID of the project",
                        },
                        name: {
                          type: "string",
                          description: "The name of the project",
                        },
                        description: {
                          type: "string",
                          description: "The description of the project",
                        },
                      },
                    },
                  },
                },
              },
            },
            500: {
              description: "Internal server error",
            },
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
              schema: {
                type: "integer",
                description: "The ID of the project",
              },
            },
          ],
          responses: {
            200: {
              description: "Project found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: {
                        type: "integer",
                      },
                      name: {
                        type: "string",
                      },
                      description: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Project not found",
            },
            500: {
              description: "Internal server error",
            },
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
              schema: {
                type: "integer",
                description: "The ID of the project",
              },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                    },
                    description: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Project updated successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid input",
            },
            404: {
              description: "Project not found",
            },
            500: {
              description: "Internal server error",
            },
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
              schema: {
                type: "integer",
                description: "The ID of the project",
              },
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
                      message: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Project not found",
            },
            500: {
              description: "Internal server error",
            },
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
                    name: {
                      type: "string",
                      description: "The name of the new project",
                    },
                    description: {
                      type: "string",
                      description: "A brief description of the new project",
                    },
                  },
                  required: ["name", "description"],
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
                      id: {
                        type: "integer",
                      },
                      message: {
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Invalid input",
            },
            500: {
              description: "Internal server error",
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
