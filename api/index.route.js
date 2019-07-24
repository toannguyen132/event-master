const express = require('express');
const authRoutes = require('./services/auth/auth.route');
const eventRoutes = require('./services/event/event.route');
const userRoutes = require('./services/user/user.route');
const uploadRoutes = require('./services/upload/upload.route');
const invoiceRoutes = require('./services/invoice/invoice.route');
const paymentRoutes = require('./services/payment/payment.route');

const router = express.Router(); // eslint-disable-line new-cap

// TODO: use glob to match *.route files

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount route
router.use('/auth', authRoutes);
router.use('/event', eventRoutes);
router.use('/user', userRoutes);
router.use('/upload', uploadRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;
