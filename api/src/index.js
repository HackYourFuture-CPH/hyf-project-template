import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routers/authRouter.js";
import courseRouter from "./routers/courseRouter.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const app = express();

app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_API_URL,
    credentials: true,
  })
);

// Initialize S3 Client with AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

app.use(bodyParser.json());
app.use(cookieParser());

// Set up Multer for file uploads with S3
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // unique key or path for the file
      const fileKey = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileKey); // Save only the key
    },
  }),
});

const apiRouter = express.Router();

// Endpoint for uploading files
app.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Extracting  the key (path) of the uploaded file
    const fileKey = req.file.key;
    res.json({
      message: "File uploaded successfully",
      fileKey: fileKey, 
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

apiRouter.use("/", authRouter);
apiRouter.use("/courses", courseRouter);

app.use("/api", apiRouter);

//middleware for handling errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.status == 404) {
    res.status(404).json({ message: err.message });
  }
  res.status(500).json({ message: "An unexpected error occurred!" });
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
