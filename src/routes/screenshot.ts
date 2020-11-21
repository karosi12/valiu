import * as express from "express";
import validator from "../helper/validateObj";
import { screenShotWebsite } from "../controllers/screenshot";
const router = express.Router();

router.post(
  "/screenshot",
  validator.screenShotJoi,
  screenShotWebsite.screenshot
);
export const screenshotRoute = router;
