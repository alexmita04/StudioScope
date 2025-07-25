const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const CATEGORY_ENUM = [
  "Branding",
  "UX Design",
  "UI Design",
  "Web Development",
  "Strategy",
  "Content Creation",
  "Social Media",
  "Motion Graphics",
  "Advertising",
  "Market Research",
];

exports.agencySchema = Joi.object({
  agency: Joi.object({
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    imageUrl: Joi.string().escapeHTML(),
    categories: Joi.array()
      .items(Joi.string().valid(...CATEGORY_ENUM))
      .length(4)
      .unique()
      .required(),
    services: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().escapeHTML(),
          description: Joi.string().required().escapeHTML(),
          imageUrl: Joi.string().escapeHTML(),
          price: Joi.number().required(),
        })
      )
      .min(1)
      .max(6)
      .required(),

    contact: Joi.object({
      email: Joi.string().email().required().escapeHTML(),
      phoneNumber: Joi.string().required().escapeHTML(),
    }).required(),
  }),
});

exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  message: Joi.string().required().escapeHTML(),
});
