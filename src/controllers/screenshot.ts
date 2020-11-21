import { Response, Request } from "express";
import captureWebsite from "capture-website";
import { uploader } from "../helper/content_upload";
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
      let { websiteName, url } = req.body;
      websiteName += +new Date();
      await captureWebsite.file(url, `../src/uploads/${websiteName}.png`, {
        fullPage: true,
      });
      const result = await uploader.uploadFile(websiteName);
      if (!result.data)
        return res.status(400).send(responsesHelper.error(400, result.message));
      logger.info(`website image uploaded successfully ${result.data}`);
      return res
        .status(201)
        .send(
          responsesHelper.success(201, { data: result.data }, result.message)
        );
    } catch (error) {
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const screenShotWebsite = new ScreenShotWebsite();
