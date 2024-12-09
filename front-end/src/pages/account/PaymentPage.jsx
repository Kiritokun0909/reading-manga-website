import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmPayment } from "../../api/PaymentService";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const VNPAY_PAYMENT_SUCCESS_CODE = "00";
  const responseCode = searchParams.get("vnp_ResponseCode");
  const orderInfo = searchParams.get("vnp_OrderInfo");

  useEffect(() => {
    const sendConfirmPayment = async () => {
      try {
        const userPlanId = orderInfo?.split(" ").pop();
        // console.log("User Plan ID:", userPlanId);
        await confirmPayment(userPlanId);
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    };

    if (responseCode && orderInfo) {
      // Remove query parameters from the URL
      navigate(window.location.pathname, { replace: true });

      console.log("Response code:", responseCode);

      if (responseCode === VNPAY_PAYMENT_SUCCESS_CODE) {
        sendConfirmPayment();
        setIsSuccess(true);
        toast.success("Thanh toán thành công");
      } else {
        toast.error("Thanh toán thất bại");
      }
    }
  }, [responseCode, orderInfo, navigate]);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center align-center">
        {isSuccess ? (
          <h2 className="text-emerald-600 font-bold">
            Thanh toán gói thành công
          </h2>
        ) : (
          <h2 className="text-red-500 font-bold">Thanh toán gói thất bại</h2>
        )}
      </div>
      <div className="mt-4">
        <Link to="/" className="text-blue-500">
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
