require("dotenv").config();

const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const { verifyAccessToken, authorizeRole } = require("../middlewares/jwt.js");
const authService = require("../app/services/AuthService.js");
const planController = require("../app/controllers/PlanController.js");

router.post("/payment-sheet", async (req, res) => {
  const { amount, currency } = req.body;
  console.log(amount, currency);

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-11-20.acacia" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount < 50000 ? 50000 : amount,
    currency: currency || "usd",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51QTGMMGfsVFLJH4QrL7XKlNqRvgFtvKf6XwqzlwikV0CKNCXagayi8x6QowQ0xXBIKgqaPvQpfIRB3eD2P3nc6E60073X1ifev",
  });
});

router.get(
  "/confirm-payment/:userPlanId",
  verifyAccessToken,
  authorizeRole([authService.RoleEnum.USER]),
  planController.updateUserPlanPaymentSuccess
);

module.exports = router;
