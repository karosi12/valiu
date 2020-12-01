import { Response, Request } from "express";
import amqp from "amqplib/callback_api";
import axios from "axios";
import redis from "redis";
const client = redis.createClient();
import { Logger } from "../logger/logger";
import { responsesHelper } from "../utils/responses";
const logging = new Logger();
const logger = logging.log("screenshot-service");
const CONN_URL = "amqp://localhost";
declare const Buffer;
client.on("error", function (error) {
  console.error(error);
});
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
      const { websiteName } = req.body;
      const queue = "screenshot-messages";
      await ch.assertQueue(queue, { durable: true });
      // console.log(ch);
      // Typescript does not support Bluebird promisifyAll so I have to use callback.
      client.exists(websiteName, async (err, found) => {
        if (err) return res.status(400).send({ message: "something is wrong" });
        if (found === 1) {
          client.get(websiteName, (err, value) => {
            if (err) throw new Error(err);
            logger.info(JSON.stringify(JSON.parse(value)));
            const data = JSON.parse(value);
            console.log(data);
            return res
              .status(201)
              .send(responsesHelper.success(201, data, "data created"));
          });
        } else {
          const payload = JSON.stringify(req.body);
          ch.sendToQueue(queue, Buffer.from(payload), {
            persistent: true,
          });
          logger.info(`payload ${JSON.stringify(req.body)}`);
          const { data } = await axios.get(
            `${process.env.RECEIVER_BASEURL}/api/screenshot/response`
          );
          logger.info(
            JSON.stringify({ data: data.data, message: data.message })
          );
          return res
            .status(201)
            .send(responsesHelper.success(201, data.data, "data created"));
        }
      });
    } catch (error) {
      logger.error(`error occured unable to capture ${JSON.stringify(error)}`);
      return res.status(500).send(responsesHelper.error(500, `${error}`));
    }
  }
}
export const screenShotWebsite = new ScreenShotWebsite();
