import Lecture from "../models/lecture-model.js";
import Course from "../models/course-model.js";
const createLecture = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, videoUrl } = req.body;

  try {
    // Ensure the course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "You do not own this course." });
    }

    // Add the lecture to the course
    const lecture = await Lecture.create({
      courseId,
      title,
      description,
      videoUrl,
    });

    res.status(201).json(lecture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding lecture." });
  }
};

export { createLecture };
