import * as Joi from "joi";
import { responsesHelper } from "../utils/responses";

const screenShotJoi = async (req, res, next) => {
  try {
    const data = await Joi.validate(req.body, screenShotSchema);
    if (data) return next();
  } catch (error) {
    if (error.details) {
      const errDetails = error.details.map((i) => ({
        message: i.message.replace(/['"]/g, ""),
      }));
      return res
        .status(400)
        .send(responsesHelper.error(400, errDetails[0].message));
    }
    return res.status(500).send(responsesHelper.error(500, error.message));
  }
};

const screenShotSchema = Joi.object().keys({
  websiteName: Joi.string().required(),
  uri: Joi.string().uri().required(),
});

export default { screenShotJoi };
