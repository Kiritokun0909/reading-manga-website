import apiClient from "./ApiClient";

const CREATE_PAYMENT_URL = "http://localhost:8888/order/create_payment_url";

//#region create-payment-url
export const createPaymentUrl = async (orderId, amount, planName) => {
  try {
    // Dynamically create a form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${CREATE_PAYMENT_URL}`;
    form.target = "_blank"; // Open in a new tab

    // Add form fields
    const addField = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    addField("orderId", orderId);
    addField("amount", amount);
    addField("bankCode", "VNBANK");
    addField("language", "vn");

    // Append the form to the document and submit
    document.body.appendChild(form);
    form.submit();

    // Remove the form after submission
    document.body.removeChild(form);
  } catch (error) {
    throw new Error(
      error?.response
        ? "Yêu cầu thất bại. Vui lòng thử lại."
        : "Hệ thống không phản hồi."
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
      return { success: false, message: "Hệ thống không phản hồi." };
    }

    return { success: false, message: "Yêu cầu thất bại. Vui lòng thử lại." };
  }
};
//#endregion
