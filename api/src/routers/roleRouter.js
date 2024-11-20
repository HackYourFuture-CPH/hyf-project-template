import express from "express";
import authenticateToken from "../../middlewares/authenticateToken.js";
import authorizeRole from "../../middlewares/authorizeRole.js";
import path from "path";

const roleRouter = express.Router();

// roleRouter.get(
//   "/dev",
//   authenticateToken,
//   authorizeRole("Developer"),
//   (req, res) => {
//     try {
//       const filePath = path.join(
//         process.cwd(),
//         "/public",
//         "dev-dashboard.html"
//       );
//       res.sendFile(filePath);
//     } catch (error) {
//       console.error("Error serving file:", error.message);
//       res.status(500).send("An error occurred while serving the file.");
//     }
//   }
// );

// roleRouter.get(
//   "/client",
//   authenticateToken,
//   authorizeRole("Client"),
//   (req, res) => {
//     try {
//       const filePath = path.join(
//         process.cwd(),
//         "/public",
//         "client-dashboard.html"
//       );
//       res.sendFile(filePath);
//     } catch (error) {
//       console.error("Error serving file:", error.message);
//       res.status(500).send("An error occurred while serving the file.");
//     }
//   }
// );

roleRouter.get(
  "/admin-dashboard",
  authenticateToken,
  authorizeRole("Admin"),
  (req, res) => {
    try {
      const filePath = path.join(
        process.cwd(),
        "/public",
        "admin-dashboard.html"
      );
      res.sendFile(filePath);
    } catch (error) {
      console.error("Error serving file:", error.message);
      res.status(500).send("An error occurred while serving the file.");
    }
  }
);

export default roleRouter;
