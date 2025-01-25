import Lecture from "../models/lecture-model.js";
import Course from "../models/course-model.js";

const generateS3Url = (fileKey) => {
  const baseUrl = process.env.AWS_S3_BASE_URL;
  return `${baseUrl}/${fileKey}`;
};

const createLecture = async (req, res) => {
  const courseId = req.params.id;
  console.log("Course Id lecture:", courseId);
  if (!courseId) {
    return res.status(404).json({ message: "courseID is not found" });
  }
  const { title, videoKey } = req.body;

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
      videoKey,
    });
    res.status(201).json(lecture);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding lecture." });
  }
};

const getLecturesByCourseId = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course does not exist" });
    }
    // Fetch all lectures that belong to the given courseId
    const lectures = await Lecture.findAll({
      where: { courseId },
    });

    if (!lectures || lectures.length === 0) {
      return res
        .status(404)
        .json({ message: "No lectures found for this course" });
    }

    // Add full S3 URL for each lecture
    const lecturesWithUrls = lectures.map((lecture) => ({
      ...lecture.dataValues, // using the datValues to get all the fields
      videoUrl: generateS3Url(lecture.videoKey),
    }));

    res.status(200).json(lecturesWithUrls);
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { createLecture, getLecturesByCourseId };
