import ProjectService from "../services/projectService.js";

class ProjectController {
  static async getAllProjects(req, res) {
    try {
      const projects = await ProjectService.getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const project = await ProjectService.getProjectById(req.params.id);
      res.status(200).json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async getProjectsByClientId(req, res) {
    try {
      const project = await ProjectService.getProjectsByClientId(req.params.id);
      res.status(200).json(project);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  static async createProject(req, res) {
    try {
      const newProject = await ProjectService.createProject(req.body);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async updateProject(req, res) {
    try {
      const updatedProject = await ProjectService.updateProject(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedProject);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProject(req, res) {
    try {
      await ProjectService.deleteProject(req.params.id);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default ProjectController;
