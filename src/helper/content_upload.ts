import * as dotenv from "dotenv";
const fs = require("fs");
dotenv.config();
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
const AWS = require("aws-sdk");
const spaceEndpoint = new AWS.Endpoint(process.env.SPACE_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spaceEndpoint,
  accessKeyId: process.env.ACCESS_KEYID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

class Upload {
  async uploadFile(websiteName) {
    if (websiteName) {
      const content = await readFileAsync(`../src/uploads/${websiteName}.png`);
      if (!content) {
        return { message: "unable to upload file", data: null };
      } else {
        const fileContent = await content;
        const params = {
          Bucket: process.env.BUCKET,
          Key: `${websiteName}.png`,
          Body: fileContent,
          ACL: "public-read",
        };
        const response = await s3.upload(params).promise();
        await unlinkAsync(`../src/uploads/${websiteName}.png`);
        if (!response) {
          return {
            message: `unable to save file ${websiteName}`,
            data: null,
          };
        }
        return {
          message: `website image was uploaded successfully`,
          data: `${response.Location}`,
        };
      }
    } else {
      return { message: "No file found, try upload again", data: null };
    }
  }
}
export const uploader = new Upload();
