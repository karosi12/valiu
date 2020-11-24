import { Response, Request } from "express";
import amqp from "amqplib/callback_api";
import { Logger } from "../logger/logger";
import { responsesHelper } from "../utils/responses";
const logging = new Logger();
const logger = logging.log("screenshot-service");
const CONN_URL = "amqp://localhost";
declare const Buffer;
let ch: {
  sendToQueue(queueName, payload);
};
amqp.connect(CONN_URL, function (err, conn) {
  conn.createChannel(function (err, channel) {
    ch = channel;
  });
});
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
      const flag = "screenshot-messages";
      const payload = JSON.stringify(req.body);
      ch.sendToQueue(flag, Buffer.from(payload));

      return res
        .status(201)
        .send(responsesHelper.success(201, req.body, "Data sent"));
    } catch (error) {
      console.log(error);
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const screenShotWebsite = new ScreenShotWebsite();
