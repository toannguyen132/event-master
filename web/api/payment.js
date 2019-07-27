
export const createPaymentApi = (api, {nonce, quantity, eventId, ticketId}) => {
  return api.post('/payment/', {
    nonce,
    quantity,
    eventId,
    ticketId
  })
}