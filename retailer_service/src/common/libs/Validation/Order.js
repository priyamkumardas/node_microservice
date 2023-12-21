const orderStatus = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: [
        'ACCEPTED',
        'NEW',
        'REJECTED',
        'CANCELLED',
        'PROCESSING',
        'READY',
        'PICKEDUP',
        'DELIVERED',
        'COMPLETED',
        'NO_SHOW',
        'DELIVERY',
      ],
    },
  },

  required: ['status'],
  additionalProperties: false,
};

const deliveryDetails = {
  type: 'object',
  properties: {
    mode: {
      type: 'string',
      enum: [
        'DELIVER',
        'PICKUP'
      ],
    },
    location: {
      type: 'object',
      properties: {
        address: {
          type: "string"
        },
        type: {
          type: "string"
        },
        lat: {
          type: "string"
        },
        lon: {
          type: "string"
        }
      }
    },
    deliveryPerson: {
      type: 'string'
    },
    deliveryDate: {
      type: 'string'
    },
    deliverySlot: {
      type: 'string'
    }
  },
  required: ['mode', 'location', 'deliveryPerson', 'deliveryDate', 'deliverySlot'],
  additionalProperties: false,
};

const getAllOrdersSchema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: [
        'ACCEPTED',
        'NEW',
        'REJECTED',
        'DISPATCHED',
        'CANCELLED',
        'PROCESSING',
        'READY',
        'PICKEDUP',
        'DELIVERED',
        'ALL',
        'PAYMENT_PENDING',
        'COMPLETED',
        'NO_SHOW',
        'DELIVERY',
      ],
    },
  },

  required: ['status'],
  additionalProperties: false,
};

module.exports = {
  getAllOrdersSchema,
  orderStatus,
  deliveryDetails
};
