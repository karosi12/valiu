import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import cors from "cors";
import { Logger } from "./logger/logger";
import express, { Application, Request, Response } from "express";
import { screenshotRoute } from "./routes/screenshot";
const API_VERSION = "/api/v1";
const app: Application = express();
dotenv.config();
const logging = new Logger();
const logger = logging.log("server");
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(API_VERSION, screenshotRoute);
app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({ message: "API is running fine" });
});

app.listen(process.env.PORT, () =>
  logger.info(`server running on ${process.env.PORT}`)
);
