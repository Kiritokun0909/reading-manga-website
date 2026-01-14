require('dotenv').config();

const express = require('express');
const router = express.Router();
const { verifyAccessToken, authorizeRole } = require('../middlewares/jwt.js');
const authService = require('../app/services/AuthService.js');
const planController = require('../app/controllers/PlanController.js');

router.post('/create', planController.createVNPayPaymentUrl);

router.post('/payment-sheet', planController.createStripePayment);

router.get(
  '/confirm-payment/:userPlanId',
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  planController.updateUserPlanPaymentSuccess
);

module.exports = router;
