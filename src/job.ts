const puppeteer = require("puppeteer");
import { CronJob } from "cron";
import { screenshotRedis } from "./redis";
console.log("Before job instantiation");
const job = new CronJob("* * * * * *", async function () {
	
  const d = new Date();
  console.log("Every second:", d);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(uri);
  await page.screenshot({ path: `./src/uploads/${websiteName}.png` });
  await browser.close();
});
console.log("After job instantiation");
job.start();

export const screenshotJob = job;
