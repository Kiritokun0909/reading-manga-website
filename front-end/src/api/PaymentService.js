import apiClient from './ApiClient';

//#region create-payment-url
export const createPaymentUrl = async (orderId, amount, planName) => {
  try {
    const response = await apiClient.post('/payment/create', {
      orderId,
      amount,
      planName,
      bankCode: 'VNBANK',
      language: 'vn',
    });

    const { paymentUrl } = response.data;

    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    } else {
      throw new Error('Không nhận được link thanh toán từ hệ thống.');
    }
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        (error?.response
          ? 'Yêu cầu thất bại. Vui lòng thử lại.'
          : 'Hệ thống không phản hồi.')
    );
  }
};
//#endregion

//#region confirm-payment
export const confirmPayment = async (userPlanId) => {
  try {
    await apiClient.get(`/payment/confirm-payment/${userPlanId}`);
    return {
      success: true,
    };
  } catch (error) {
    if (!error?.response) {
      return { success: false, message: 'Hệ thống không phản hồi.' };
    }

    return { success: false, message: 'Yêu cầu thất bại. Vui lòng thử lại.' };
  }
};
//#endregion
