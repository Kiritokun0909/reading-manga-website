import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import HandleCode from "../../../utilities/HandleCode";
import { AuthContext } from "../../../context/AuthContext";

import { getPlanDetail } from "../../../api/SiteService";
import { buyPlan } from "../../../api/AccountService";
import { createPaymentUrl } from "../../../api/PaymentService";

export default function PlanModal({ planId, onClose, isFromUser = false }) {
  const { isLoggedIn } = useContext(AuthContext);

  const [planName, setPlanName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [canReadAll, setCanReadAll] = useState("");

  const [selectedMangas, setSelectedMangas] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const fetchSelectedMangas = async () => {
      try {
        const data = await getPlanDetail(planId);
        setPlanName(data.planName);
        setPrice(data.price);
        setDuration(data.duration);
        setDescription(data.description);
        setStartAt(data.startAt);
        setEndAt(data.endAt ? data.endAt : "Vô thời hạn");
        setCanReadAll(data.canReadAll === HandleCode.CAN_READ_ALL);

        setSelectedMangas(data.mangas);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchSelectedMangas();
  }, [planId]);

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const handleBuyPlanClick = async (planId) => {
    if (!isLoggedIn) {
      toast.error("Vui lòng đăng nhập để mua gói.");
      return;
    }

    try {
      const response = await buyPlan(planId);
      const orderId = response.userPlanId;
      createPaymentUrl(orderId, price, planName);
      onClose();
      // toast.success("Mua gói thành công");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Check if the current date is greater than the endAt date
  const isPlanExpired = () => {
    if (endAt === "Vô thời hạn") return false;
    const currentDate = new Date();
    const endDate = new Date(endAt);
    return currentDate > endDate;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col border shadow rounded-lg p-3 bg-white w-1/2">
        {/* Modal Header */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300">
            Gói {planName}
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-around border-b mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === "info"
                ? "border-b-2 border-violet-600 text-violet-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "mangas"
                ? "border-b-2 border-violet-600 text-violet-600"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("mangas")}
          >
            Danh sách truyện
          </button>
        </div>

        {activeTab === "info" && (
          <div className="h-96 flex flex-col gap-2 px-8">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Giá: {formatPrice(price)} (VNĐ)
              </span>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Thời hạn: {duration} ngày
              </span>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Ngày bắt đầu: {startAt}
              </span>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Ngày kết thúc: {endAt ? endAt : "Vô thời hạn"}
              </span>
            </div>

            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Mô tả gói: {description ? description : "Không có mô tả gói"}
              </span>
            </div>
          </div>
        )}

        {activeTab === "mangas" && (
          <div className="flex flex-col">
            <div className="flex flex-col">
              {canReadAll && (
                <span className="text-gray-600 dark:text-gray-400">
                  Cho phép đọc tất cả truyện trả phí
                </span>
              )}
            </div>

            {/* Show selected manga */}
            <div className="h-96 overflow-y-auto">
              {selectedMangas.map((manga) => (
                <div
                  key={manga.mangaId}
                  className="flex items-center gap-2 p-2 border-b border-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700"
                >
                  <img
                    src={manga.coverImageUrl}
                    alt={manga.mangaName}
                    className="w-16 h-20 rounded-md"
                  />
                  <span>{manga.mangaName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="p-2 py-1.5 px-3 bg-red-700 text-white rounded-md hover:bg-red-500"
            onClick={() => onClose()}
          >
            Đóng
          </button>
          {!isPlanExpired() && (
            <button
              className="p-2 py-1.5 px-3 bg-violet-700 text-white rounded-md hover:bg-violet-500"
              onClick={() => handleBuyPlanClick(planId)}
            >
              {isFromUser ? "Mua lại" : "Mua ngay"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
