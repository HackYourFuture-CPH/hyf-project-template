import ProjectDeveloper from "../models/role.js";
import User from "../models/user.js";

class RoleService {
  static async getAllDevelopers() {
    try {
      const allDevelopers = await ProjectDeveloper.findAll({
        include: [
          {
            model: User,
            as: "Developer",
            where: { roleId: 1 },
          },
        ],
      });
      return allDevelopers;
    } catch (error) {
      throw new Error("Error fetching all developers: " + error.message);
    }
  }

  static async getAllClients() {
    try {
      const allClients = await ProjectDeveloper.findAll({
        include: [
          {
            model: User,
            as: "Client",
            where: { roleId: 2 },
          },
        ],
      });
      return allClients;
    } catch (error) {
      throw new Error("Error fetching all clients: " + error.message);
    }
  }
}

export default RoleService;
