const inviteSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["INDIVIDUAL", "RETAILER"],
    },
    phone: {
      type: "string",
      pattern: "^[0-9]{10}$",
    },
  },
  required: ["type", "phone"],
  additionalProperties: false,
};
const phone = {
  type: "object",
  properties: {
    phone: {
      type: "string",
      pattern: "^[0-9]{10}$",
    },
  },
  required: ["phone"],
  additionalProperties: true,
};

module.exports = { inviteSchema, phone };
