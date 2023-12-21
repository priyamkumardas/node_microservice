const WorkingHours = {
  type: 'object',
  properties: {
    workingHours: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dName: {
            type: 'string',
            enum: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
          },
          isEnable: { type: 'boolean' },
          alltime: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                startTime: {
                  type: 'string',
                  pattern:
                    '^(?:[1-9][0-9]{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9][0-9](?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:Z|[+-][01][0-9]:[0-5][0-9])$',
                },
                endTime: {
                  type: 'string',
                  pattern:
                    '^(?:[1-9][0-9]{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9][0-9](?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)T(?:[01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](?:Z|[+-][01][0-9]:[0-5][0-9])$',
                },
              },
              required: ['startTime', 'endTime'],
            },
          },
        },
        required: ['dName', 'isEnable', 'alltime'],
      },
    },
  },
  required: ['workingHours'],
  additionalProperties: true,
};

module.exports = {
  WorkingHours,
};
