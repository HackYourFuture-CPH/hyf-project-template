import User from "../models/user.js";
import Role from "../models/role.js";
import ProjectDevelopers from "../models/projectDeveloper.js";
class ProjectDeveloperService {
  static async getAllDevelopers() {
    try {
      const allDevelopers = await User.findAll({
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["roleName"],
          },
        ],
        where: { roleId: 1 },
      });
      return allDevelopers;
    } catch (error) {
      throw new Error("Error fetching all developers: " + error.message);
    }
  }
  static async getAllClients() {
    try {
      const allClients = await User.findAll({
        include: [
          {
            model: Role,
            as: "role",
            attributes: ["roleName"],
          },
        ],
        where: { roleId: 2 },
      });
      return allClients;
    } catch (error) {
      throw new Error("Error fetching all clients: " + error.message);
    }
  }

  static async getDevelopersForProject(projectId) {
    try {
      const projectDevelopers = await ProjectDevelopers.findAll({
        where: { projectId: projectId },
        include: ["Developer"],
      });
      return projectDevelopers;
    } catch (error) {
      throw new Error(
        "Error fetching developers for project: " + error.message
      );
    }
  }

  static async assignDeveloperToProject(projectId, developerId) {
    try {
      await ProjectDevelopers.create({
        projectId: projectId,
        developerId: developerId,
        assignedDate: new Date(),
      });
      return { message: "Developer assigned to project successfully." };
    } catch (error) {
      throw new Error("Error assigning developer to project: " + error.message);
    }
  }

  static async removeDeveloperFromProject(projectId, developerId) {
    try {
      const deleted = await ProjectDevelopers.destroy({
        where: { projectId: projectId, developerId: developerId },
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

  static async getProjectsByDeveloperId(id) {
    try {
      const project = await ProjectDevelopers.findAll({
        where: { developerId: id },
      });
      if (!project) {
        throw new Error("Projects not found");
      }
      return project;
    } catch (error) {
      throw new Error("Error fetching projects: " + error.message);
    }
  }

  // static async getProjectClient(projectId) {
  //   try {
  //     const projectDevelopers = await ProjectDevelopers.findAll({
  //       where: { projectId: projectId },
  //       include: ["Client"],
  //     });
  //     return projectDevelopers;
  //   } catch (error) {
  //     throw new Error(
  //       "Error fetching developers for project: " + error.message
  //     );
  //   }
  // }
}

export default ProjectDeveloperService;
