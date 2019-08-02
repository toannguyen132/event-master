
export const createPaymentApi = (api, {nonce, quantity, eventId, ticketId, name, address}) => {
  return api.post('/payment/', {
    nonce,
    quantity,
    eventId,
    ticketId,
    name, 
    address
  })
}