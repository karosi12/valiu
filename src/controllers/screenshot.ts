import { Response, Request } from "express";
import amqp from "amqplib/callback_api";
import { Logger } from "../logger/logger";
import { responsesHelper } from "../utils/responses";
const logging = new Logger();
const logger = logging.log("screenshot-service");
const CONN_URL = "amqp://localhost";
declare const Buffer;
let ch: {
  assertQueue(queueName, {});
  consume(queue: string, callback: Function);
  sendToQueue(queueName, payload, {});
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
      const queue = "screenshot-messages";
      const recieveQueue = "recieve-screenshot";
      const payload = JSON.stringify(req.body);
      ch.assertQueue(queue, {
        durable: true,
      });
      const response = ch.sendToQueue(queue, Buffer.from(payload), {
        persistent: true,
      });
      logger.info(`payload => ${JSON.stringify(req.body)}`);
      ch.consume(recieveQueue, async function (msg) {
        const { uri } = JSON.parse(msg.content.toString());
        if (response)
          return res
            .status(201)
            .send(responsesHelper.success(201, { data: uri }, "success"));
        return res
          .status(400)
          .send(responsesHelper.error(400, "Request not resolved"));
      });
    } catch (error) {
      console.log(error);
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const screenShotWebsite = new ScreenShotWebsite();
