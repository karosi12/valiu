import { Response, Request } from "express";
import Pageres from "pageres";
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);
import * as dotenv from "dotenv";

dotenv.config();
const AWS = require("aws-sdk");
const spaceEndpoint = new AWS.Endpoint(process.env.SPACE_ENDPOINT);
const s3 = new AWS.S3({
  endpoint: spaceEndpoint,
  accessKeyId: process.env.ACCESS_KEYID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});
import { Logger } from "../logger/logger";
import { Config } from "../config/config";
import { responsesHelper } from "../utils/responses";
const logging = new Logger();
const logger = logging.log("screenshot-service");

class Capturewebsite {
  /**
   * create
   * @desc users should be able to tak a screenshot of a website and get the image url
   * Route: POST: '/api/v1/screenshot'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async screenshot(req: Request, res) {
    try {
      let { websiteName, url } = req.body;
      websiteName += +new Date();
      await new Pageres({ delay: 2 })
        .src(url, ["1280x1024"], { filename: websiteName })
        .dest("./uploads")
        .run();
      return res
        .status(201)
        .send(responsesHelper.success(201, { data: "ok" }, "page captured"));
    } catch (error) {
      console.log(error);
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const captureWebsite = new Capturewebsite();
