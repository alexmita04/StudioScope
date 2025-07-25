const { agencySchema, reviewSchema } = require("./schemas");
const sanitizeHtml = require("sanitize-html");

describe("Joi Schemas", () => {
  describe("agencySchema", () => {
    const validAgency = {
      agency: {
        name: "Design Studio",
        description: "We build beautiful interfaces.",
        imageUrl: "http://example.com/image.png",
        categories: ["Branding", "UX Design", "UI Design", "Strategy"],
        services: [
          {
            name: "Web Design",
            description: "We create stunning websites.",
            imageUrl: "http://example.com/service.png",
            price: 1500,
          },
        ],
        contact: {
          email: "contact@designstudio.com",
          phoneNumber: "1234567890",
        },
      },
    };

    it("validates a correct agency object", () => {
      const { error } = agencySchema.validate(validAgency);
      expect(error).toBeUndefined();
    });

    it("fails if categories are not exactly 4", () => {
      const invalid = {
        ...validAgency,
        agency: { ...validAgency.agency, categories: ["Branding"] },
      };
      const { error } = agencySchema.validate(invalid);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/must contain 4 items/);
    });

    it("fails if category is not in enum", () => {
      const invalid = {
        ...validAgency,
        agency: {
          ...validAgency.agency,
          categories: ["InvalidCat", "UX Design", "UI Design", "Strategy"],
        },
      };
      const { error } = agencySchema.validate(invalid);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/must be one of/);
    });

    it("fails if HTML is present in name", () => {
      const htmlAgency = {
        ...validAgency,
        agency: {
          ...validAgency.agency,
          name: "<script>alert('x')</script>",
        },
      };
      const { error } = agencySchema.validate(htmlAgency);
      expect(error).toBeDefined();
      expect(error.details[0].type).toBe("string.escapeHTML");
    });

    it("fails if services.description is missing (check typo)", () => {
      const invalid = JSON.parse(JSON.stringify(validAgency));
      delete invalid.agency.services[0].description;
      const { error } = agencySchema.validate(invalid);
      expect(error).toBeDefined();
    });

    it("fails if email is invalid", () => {
      const invalid = {
        ...validAgency,
        agency: {
          ...validAgency.agency,
          contact: {
            ...validAgency.agency.contact,
            email: "notanemail",
          },
        },
      };
      const { error } = agencySchema.validate(invalid);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(/must be a valid email/);
    });

    it("fails if services exceeds max length", () => {
      const services = Array.from({ length: 7 }).map((_, i) => ({
        name: `Service ${i + 1}`,
        description: "A service",
        imageUrl: "http://example.com/service.png",
        price: 100,
      }));
      const invalid = {
        ...validAgency,
        agency: {
          ...validAgency.agency,
          services,
        },
      };
      const { error } = agencySchema.validate(invalid);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(
        /must contain less than or equal to 6 items/
      );
    });
  });

  describe("reviewSchema", () => {
    it("validates a correct review", () => {
      const review = {
        rating: 5,
        message: "Great service!",
      };
      const { error } = reviewSchema.validate(review);
      expect(error).toBeUndefined();
    });

    it("fails if rating is too low", () => {
      const review = { rating: 0, message: "Bad" };
      const { error } = reviewSchema.validate(review);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(
        /must be greater than or equal to 1/
      );
    });

    it("fails if rating is too high", () => {
      const review = { rating: 6, message: "Too good?" };
      const { error } = reviewSchema.validate(review);
      expect(error).toBeDefined();
      expect(error.details[0].message).toMatch(
        /must be less than or equal to 5/
      );
    });

    it("fails if message contains HTML", () => {
      const review = { rating: 4, message: "<b>Nice!</b>" };
      const { error } = reviewSchema.validate(review);
      expect(error).toBeDefined();
      expect(error.details[0].type).toBe("string.escapeHTML");
    });

    it("fails if message is missing", () => {
      const review = { rating: 4 };
      const { error } = reviewSchema.validate(review);
      expect(error).toBeDefined();
    });
  });
});
