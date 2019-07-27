const Joi = require('@hapi/joi');

module.exports = {

  /**
   * Auth routes
   */
  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // POST /api/auth/register
  register: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(6).required(),
      passwordConfirm: Joi.any().valid(Joi.ref('password')).options({ language: { any: { allowOnly: 'must match password' } } }).required()
    }
  },

  // events

  searchEvent: {
    body: {},
    query: {
      s: Joi.string(),
      startDate: Joi.string()
    }
  },

  createEvent: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      tickets: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().required(),
        number: Joi.number(),
        leftOver: Joi.number()
      }))
    }
  },

  updateEvent: {
    params: {
      id: Joi.string().required()
    },
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      tickets: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number(),
        number: Joi.number(),
        leftOver: Joi.number()
      }))
    }
  },

  uploadEvent: {
    params: {
      id: Joi.string().required()
    },
  },

  /**
   * Users
   */
  updateProfile: {
    body: {
      name: Joi.string(),
      dob: Joi.string(),
      address: Joi.string(),
      phone: Joi.string()
    }
  },

  upload: {
    params: {
      type: Joi.string().valid('event', 'avatar')
    },
  },

  deleteUpload: {
    params: {
      id: Joi.string().required()
    },
  },

  // subscription
  subscribe: {
    body: {
      categoryId: Joi.string().required()
    }
  },
  deleteSubscription: {
    params: {
      id: Joi.string().required()
    }
  },

  purchase: {
    params: {
      id: Joi.string().required()
    },
    body: {
      quantity: Joi.number().required(),
      address: Joi.string().required(),
      name: Joi.string().required(),
      price: Joi.number().required(),
      ticketType: Joi.string().required(),
    }
  },

  createPayment: {
    body: {
      nonce: Joi.string().required(),
      eventId: Joi.string().required(),
      ticketId: Joi.string().required(),
      quantity: Joi.number().required(),
    }
  }

};
