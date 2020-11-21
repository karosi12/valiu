import * as express from "express";
import { captureWebsite } from "../controllers/screenshot";
const router = express.Router();

router.post("/screenshot", captureWebsite.screenshot);
export const screenshotRoute = router;
