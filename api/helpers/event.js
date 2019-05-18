
const EVENT_PER_PAGE = 50;

/**
 *
 * @param params
 */
const refineSearchParams = (params) => {
  if (params.startDate) {
    params.startDate = new Date();
  }
  if (params.page) {
    params.skip = (params.page - 1) * EVENT_PER_PAGE;
    params.limit = EVENT_PER_PAGE;
  }

  return params;
}

const refineResponseEvent = (event) => {
  return {
    id: event._id,
    name: event.name,
    description: event.description,
    location: event.location,
    category: event.category.map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
    })),
    startDate: event.startDate,
    endDate: event.endDate,
    image: event.image,
    tickets: event.tickets,
    createdAt: event.createdAt
  }

  return resp;
}

module.exports = { refineSearchParams, refineResponseEvent }
