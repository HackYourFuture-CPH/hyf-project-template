import { Storage } from "@google-cloud/storage";
import path from "path";

const keyFilePath = path.join(
  process.cwd(),
  "config",
  "service-account-key.json"
);

export const storage = new Storage({
  projectId: "leafnotes-440916",
  keyFilename: keyFilePath,
});

const bucketNAME = "leafnotes-bucket";
export const bucket = storage.bucket(bucketNAME);
