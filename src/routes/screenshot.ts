import * as express from "express";
import { screenShotWebsite } from "../controllers/screenshot";
const router = express.Router();

router.post("/screenshot", screenShotWebsite.screenshot);
export const screenshotRoute = router;
