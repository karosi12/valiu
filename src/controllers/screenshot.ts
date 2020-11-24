import { Response, Request } from "express";
// const puppeteer = require("puppeteer");
// import { uploader } from "../helper/content_upload";
import { screenshotRedis } from "../redis";
import { Logger } from "../logger/logger";
import { responsesHelper } from "../utils/responses";
const logging = new Logger();
const logger = logging.log("screenshot-service");
class ScreenShotWebsite {
  /**
   * create
   * @desc users should be able to tak a screenshot of a website and get the image url
   * Route: POST: '/api/v1/screenshot'
   * @param {Object} req request object
   * @param {Object} res response object
   * @returns {void|Object} object
   */
  async screenshot(req: Request, res: Response) {
    try {
      const redisKey = +new Date();
      const payload = JSON.stringify(req.body);
      screenshotRedis.set(redisKey, payload);
      screenshotRedis.get(redisKey, function (error, result) {
        if (error) {
          console.log(error);
          throw error;
        }
        return res
          .status(201)
          .send(
            responsesHelper.success(
              201,
              JSON.parse(result),
              "Data sent to queue"
            )
          );
      });
    } catch (error) {
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const screenShotWebsite = new ScreenShotWebsite();
