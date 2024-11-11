import ProjectDeveloper from "../models/projectDeveloper.js";

class ProjectDeveloperService {
  static async assignDeveloperToProject(projectId, developerId) {
    try {
      await ProjectDeveloper.create({
        project_id: projectId,
        developer_id: developerId,
        assigned_date: new Date(),
      });
      return { message: "Developer assigned to project successfully." };
    } catch (error) {
      throw new Error("Error assigning developer to project: " + error.message);
    }
  }

  static async getDevelopersForProject(projectId) {
    try {
      const projectDevelopers = await ProjectDeveloper.findAll({
        where: { project_id: projectId },
        include: ["Developer"],
      });
      return projectDevelopers;
    } catch (error) {
      throw new Error(
        "Error fetching developers for project: " + error.message
      );
    }
  }

  static async getAllDevelopers() {
    try {
      const allDevelopers = await ProjectDeveloper.findAll({
        include: ["Developer"],
      });
      return allDevelopers;
    } catch (error) {
      throw new Error("Error fetching all developers: " + error.message);
    }
  }

  static async getAllClients() {
    try {
      const projectDevelopers = await ProjectDeveloper.findAll({
        include: ["Client"],
      });
      return projectDevelopers;
    } catch (error) {
      throw new Error("Error fetching all clients: " + error.message);
    }
  }

  static async getProjectClient(projectId) {
    try {
      const projectDevelopers = await ProjectDeveloper.findAll({
        where: { project_id: projectId },
        include: ["Client"],
      });
      return projectDevelopers;
    } catch (error) {
      throw new Error("Error fetching client for project: " + error.message);
    }
  }

  static async removeDeveloperFromProject(projectId, developerId) {
    try {
      const deleted = await ProjectDeveloper.destroy({
        where: { project_id: projectId, developer_id: developerId },
      });
      if (deleted) {
        return { message: "Developer removed from project successfully." };
      }
      throw new Error("Developer not found in project.");
    } catch (error) {
      throw new Error(
        "Error removing developer from project: " + error.message
      );
    }
  }
}

export default ProjectDeveloperService;
