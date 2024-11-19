import Project from "../models/projects.js";

class ProjectService {
  static async createProject(data) {
    try {
      const newProject = await Project.create(data);
      return newProject;
    } catch (error) {
      throw new Error("Error creating project: " + error.message);
    }
  }

  static async getAllProjects() {
    try {
      const projects = await Project.findAll();
      return projects;
    } catch (error) {
      throw new Error("Error fetching projects: " + error.message);
    }
  }

  static async getProjectById(id) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching project: " + error.message);
    }
  }

  static async getProjectsByClientId(clientId) {
    try {
      const project = await Project.findAll({
        where: { clientId: clientId },
      });
      if (!project) {
        throw new Error("Project or client not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching projects: " + error.message);
    }
  }

  static async updateProject(id, updatedData) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Project not found");
      }
      const updatedProject = await project.update(updatedData);
      return updatedProject;
    } catch (error) {
      throw new Error("Error updating project: " + error.message);
    }
  }

  static async deleteProject(id) {
    try {
      const project = await Project.findByPk(id);
      if (!project) {
        throw new Error("Project not found");
      }
      await project.destroy();
      return { message: "Project deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting project: " + error.message);
    }
  }
}

export default ProjectService;
