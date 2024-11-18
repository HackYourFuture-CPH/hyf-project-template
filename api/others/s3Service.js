const AWS = require("aws-sdk");

// Load AWS credentials from environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Create an S3 instance
const s3 = new AWS.S3();

// Function to upload a file
const uploadFile = async (fileBuffer, fileName, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/octet-stream", // Adjust based on your file type
    ACL: "public-read", // Optional: Set the ACL (permissions)
  };

  try {
    const data = await s3.upload(params).promise();
    return data; // Returns the data about the uploaded file, including URL
  } catch (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Function to get file from S3
const getFile = async (fileName, bucketName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3.getObject(params).promise();
    return data.Body; // The file content as buffer
  } catch (error) {
    throw new Error(`Error getting file: ${error.message}`);
  }
};

module.exports = { uploadFile, getFile };
