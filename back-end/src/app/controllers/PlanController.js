// src/app/controllers/PlanController.js
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { VNPay } = require('vnpay');
const PlanService = require('../services/PlanService.js');
const HandleCode = require('../../utilities/HandleCode.js');

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_SECRET,
  testMode: true,
});

class PlanController {
  //#region get-subscriptions
  async getPlans(req, res) {
    const { itemsPerPage, pageNumber, filter, keyword } = req.query;
    try {
      const result = await PlanService.getPlans(
        parseInt(itemsPerPage),
        parseInt(pageNumber),
        filter,
        keyword
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to get plans:', err);
      res.status(500).json({
        message: 'Failed to get plans. Please try again later',
      });
    }
  }
  //#endregion

  //#region get-subscription-by-id
  async getPlanById(req, res) {
    const { planId } = req.params;
    try {
      const result = await PlanService.getPlanById(planId);
      if (result && result.code == HandleCode.NOT_FOUND) {
        res.status(404).json({ message: 'Plan not found' });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to get plan by id:', err);
      res.status(500).json({
        message: 'Failed to get plan by id. Please try again later',
      });
    }
  }
  //#endregion

  //#region get-plan-by-manga-id
  async getPlanByMangaId(req, res) {
    const { mangaId } = req.params;
    try {
      const result = await PlanService.getPlanByMangaId(mangaId);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to get plan by manga id:', err);
      res.status(500).json({
        message: 'Failed to get plan by manga id. Please try again later',
      });
    }
  }
  //#endregion

  //#region add-plan
  async addPlan(req, res) {
    const {
      planName,
      price,
      duration,
      description,
      startAt,
      endAt,
      canReadAll,
      mangaIds,
    } = req.body;
    try {
      const result = await PlanService.addPlanInfo(
        planName,
        price,
        duration,
        description,
        startAt,
        endAt,
        canReadAll
      );

      await PlanService.updatePlanMangas(result.planId, mangaIds);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to add subscription:', err);
      res.status(500).json({
        message: 'Failed to add subscription. Please try again later',
      });
    }
  }
  //#endregion

  //#region update-subscription
  async updatePlan(req, res) {
    const { planId } = req.params;
    const {
      planName,
      price,
      duration,
      description,
      startAt,
      endAt,
      canReadAll,
      mangaIds,
    } = req.body;
    try {
      const result = await PlanService.updatePlanInfo(
        planId,
        planName,
        price,
        duration,
        description,
        startAt,
        endAt,
        canReadAll
      );

      await PlanService.updatePlanMangas(planId, mangaIds);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to update plan:', err);
      res.status(500).json({
        message: 'Failed to update plan. Please try again later',
      });
    }
  }
  //#endregion

  //#region delete-plan
  async deletePlan(req, res) {
    const { planId } = req.params;
    try {
      const result = await PlanService.deletePlanbyId(planId);
      if (result && result.code == HandleCode.BOUGHT_BY_USER) {
        res.status(405).json({
          message: 'Cannot delete plan because having user bought it.',
        });
        return;
      }

      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to delete plan:', err);
      res.status(500).json({
        message: 'Failed to delete plan. Please try again later',
      });
    }
  }
  //#endregion

  //#region buy-plan
  async buyPlan(req, res) {
    const { planId } = req.params;
    const userId = req.user.id;
    try {
      const checkBeforeBuy = await PlanService.checkUserCanBoughtPlan(userId, planId);
      if (!checkBeforeBuy) {
        res.status(405).json({
          message: 'Plan has been actived. User cannot buy again until it expires',
        });
        return;
      }
      const planDetail = await PlanService.getPlanById(planId);
      const result = await PlanService.addUserPlan(userId, planId, planDetail.price);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to buy plan:', err);
      res.status(500).json({
        message: 'Failed to buy plan. Please try again later',
      });
    }
  }
  //#endregion

  //#region get-user-plan
  async getUserPlan(req, res) {
    const { itemsPerPage, pageNumber } = req.query;
    const userId = req.user.id;
    try {
      const result = await PlanService.getPurchaseHistoryByUserId(
        parseInt(itemsPerPage),
        parseInt(pageNumber),
        userId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to get user plan:', err);
      res.status(500).json({
        message: 'Failed to get user plan. Please try again later',
      });
    }
  }
  //#endregion

  //# region check-user-bought-plan
  async checkUserBoughtPlan(req, res) {
    const { planId } = req.params;
    const userId = req.user.id;
    try {
      const result = await PlanService.checkUserBoughtPlan(userId, planId);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to check user bought plan:', err);
      res.status(500).json({
        message: 'Failed to check user bought plan. Please try again later',
      });
    }
  }
  //#endregion

  //#region check-user-bought-manga
  async checkUserBoughtManga(req, res) {
    const { mangaId } = req.params;
    const userId = req.user.id;
    try {
      const result = await PlanService.checkUserBoughtManga(userId, mangaId);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to check user bought manga:', err);
      res.status(500).json({
        message: 'Failed to check user bought manga. Please try again later',
      });
    }
  }
  //#endregion

  //#region update-user-plan-payment-success
  async updateUserPlanPaymentSuccess(req, res) {
    const { userPlanId } = req.params;
    try {
      const result = await PlanService.updateUserPlanPaymentSuccess(userPlanId);
      res.status(200).json(result);
    } catch (err) {
      console.log('Failed to update user plan payment success:', err);
      res.status(500).json({
        message: 'Failed to update user plan payment success. Please try again later',
      });
    }
  }
  //#endregion

  //#region create vnpay payment url
  async createVNPayPaymentUrl(req, res) {
    try {
      const { orderId, amount, bankCode, planName } = req.body;

      const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: req.ip,
        vnp_TxnRef: `${orderId}`,
        vnp_OrderInfo: `Thanh toan goi doc truyen ${planName} ma ${orderId}`,
        vnp_ReturnUrl: `${process.env.VNP_RETURN_URL}`,
        vnp_BankCode: bankCode ?? undefined,
        vnp_Locale: 'vn',
      });

      res.json({ success: true, paymentUrl });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
  //#endregion

  //#region create stripe payment
  async createStripePayment(req, res) {
    const { amount, currency } = req.body;
    console.log(amount, currency);

    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2024-11-20.acacia' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount < 50000 ? 50000 : amount,
      currency: currency || 'usd',
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
        'pk_test_51QTGMMGfsVFLJH4QrL7XKlNqRvgFtvKf6XwqzlwikV0CKNCXagayi8x6QowQ0xXBIKgqaPvQpfIRB3eD2P3nc6E60073X1ifev',
    });
  }
  //#endregion
}

module.exports = new PlanController();
