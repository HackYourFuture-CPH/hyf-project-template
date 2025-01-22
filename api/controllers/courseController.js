import Course from "../models/course-model.js";
import User from "../models/user-model.js";

const createCourse = async (req, res) => {;
    const instructorId = req.user.id
    const { title, description, imageUrl } = req.body;

    try {
      // Ensure the instructor exists and is valid
      const instructor = await User.findOne({ where: { id: instructorId, role: "instructor" } });
      if (!instructor) {
        return res.status(404).json({ message: "Instructor not found or invalid." });
      }
  
      // Create the course
      const course = await Course.create({ title, description, instructorId, imageUrl });
  
      res.status(201).json(course);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating course." });
    }
};


export { createCourse };
