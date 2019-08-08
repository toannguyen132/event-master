
const EVENT_PER_PAGE = 2;

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
  const coordinate = event.lat && event.lng && {
    lat: event.lat,
    lng: event.lng
  }

  const tickets = event.tickets ?  event.tickets.map(t => ({
    id: t._id,
    ...t.toJSON(),
    price: t.price
  })) : [];
  
  // console.log(tickets);
  // console.log(event.tickets);
  
  return {
    id: event._id,
    name: event.name,
    description: event.description,
    location: event.location,
    coordinate,
    category: event.category.map(cat => ({
      id: cat._id,
      name: cat.name,
      slug: cat.slug,
    })),
    owner: event.owner ? {
      name: event.owner.name,
      email: event.owner.email,
      id: event.owner._id,
    } : null,
    startDate: event.startDate,
    endDate: event.endDate,
    images: event.image.map(_getImageResp),
    tickets: tickets,
    goingCount: event.goingCount,
    createdAt: event.createdAt
  }
}

const _getImageResp = (img) => {
  return {
    id: img.id,
    filename: img.filename,
    type: img.type,
    createdAt: img.createdAt
  }
}

const refineResponseCategory = category => ({
  id: category._id,
  name: category.name,
  slug: category.slug
})

const createSearchFilter = (params) => {
  const filter = {
    s: params.search,
    category: params.category,
    fromDate: params.fromDate,
    toDate: params.toDate,
    limit: params.limit,
    skip: params.skip
  }
  const newFilters = {}
  Object.keys(filter).forEach( key => {
    if (filter[key]) newFilters[key] = filter[key]
  });
  return newFilters;
}

module.exports = { refineSearchParams, refineResponseEvent, refineResponseCategory, createSearchFilter}
