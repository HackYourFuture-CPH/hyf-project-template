import { Storage } from "@google-cloud/storage";
import path from "path";

const keyFilePath = path.join(process.cwd(), "key.json");

const storage = new Storage({
  projectId: "leafnotes-440916",
  keyFilename: keyFilePath,
});

const bucketNAME = "leafnotes-bucket";
const bucket = storage.bucket(bucketNAME);

export default { storage, bucket };
