import expect from "expect.js";
import request from "supertest";
import app from "../../dist/app";

describe("#POST Screenshot", function () {
  this.timeout(120000);
  it("Screenshot and upload a website", async () => {
    try {
      const payload = {
        websiteName: "twitter",
        uri: "https://twitter.com",
      };
      const res = await request(app)
        .post("/api/v1/screenshot")
        .send(payload)
        .set("Accept", "application/json")
        .expect(201);
      expect(res.body).have.property("error");
      expect(res.body).have.property("message");
      expect(res.body).have.property("errorCode");
      expect(res.body).have.property("data");
      expect(res.body.data).have.property("uri");
      expect(res.body.data).have.property("websiteName");
    } catch (error) {
      throw new Error(error);
    }
  });
});
