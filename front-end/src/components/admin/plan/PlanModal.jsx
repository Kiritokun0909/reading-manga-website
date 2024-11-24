import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HandleCode from "../../../utilities/HandleCode";

import { getListManga, getPlanDetail } from "../../../api/SiteService";

export default function PlanModal({ plan, onClose, onSave }) {
  const [planName, setPlanName] = useState(plan?.planName || "Gói mới");
  const [price, setPrice] = useState(plan?.price || 500);
  const [duration, setDuration] = useState(plan?.duration || 14);
  const [description, setDescription] = useState(plan?.description || "");
  const [startAt, setStartAt] = useState(
    plan?.startAt || new Date().toISOString().slice(0, 16)
  );
  const [endAt, setEndAt] = useState(plan?.endAt || "");
  const [canReadAll, setCanReadAll] = useState(
    plan?.canReadAll === HandleCode.CAN_READ_ALL
  );

  const [searchName, setSearchName] = useState("");
  const [searchMangas, setSearchMangas] = useState([]);
  const [selectedMangas, setSelectedMangas] = useState([]);

  const [activeTab, setActiveTab] = useState("info");

  const PAGE_NUMBER = 1;
  const ITEMS_PER_PAGE = 100;

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const data = await getListManga(
          PAGE_NUMBER,
          ITEMS_PER_PAGE,
          HandleCode.FILTER_BY_MANGA_UPDATE_DATE_DESC,
          searchName
        );
        setSearchMangas(data.mangas);
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchSelectedMangas = async () => {
      try {
        const data = await getPlanDetail(plan.planId);
        setSelectedMangas(data.mangas);
        setCanReadAll(data.canReadAll === HandleCode.CAN_READ_ALL);
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchMangas();
    console.log(plan);
    if (plan) fetchSelectedMangas();
  }, [searchName, plan]);

  const checkBeforeSave = () => {
    if (!canReadAll && selectedMangas.length === 0) {
      toast.error(
        "Danh sách truyện thuộc gói đang trống. Vui lòng thêm truyện."
      );
      return false;
    }

    if (planName === "") {
      toast.error("Vui lòng nhập tên gói.");
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!checkBeforeSave()) {
      return;
    }

    const updatedPlan = {
      ...plan,
      planName: planName,
      price: price,
      duration: duration,
      description: description,
      startAt: startAt,
      endAt: endAt,
      canReadAll: canReadAll,
      mangaIds: selectedMangas.map((manga) => manga.mangaId),
    };
    onSave(updatedPlan);
  };

  const addToSelectedMangas = (manga) => {
    if (canReadAll) return;
    setSelectedMangas((prevSelected) => [...prevSelected, manga]);
  };

  const removeFromSelectedMangas = (mangaId) => {
    setSelectedMangas((prevSelected) =>
      prevSelected.filter((manga) => manga.mangaId !== mangaId)
    );
  };

  const handlePriceChange = (e) => {
    const input = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

    const minPrice = 10000;
    setPrice(Math.max(minPrice, parseInt(input || 0)));
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const handleSelectCanReadAll = () => {
    setCanReadAll(!canReadAll);
    setSelectedMangas([]); // Clear selected mangas when canReadAll is unchecked
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="flex flex-col border shadow rounded-lg p-3 bg-white w-1/2">
        {/* Modal Header */}
        <div className="text-center">
          <h2 className="text-xl text-gray-600 dark:text-gray-300">
            {plan ? "Chỉnh sửa gói" : "Thêm gói mới"}
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
          <div className="flex flex-col gap-2">
            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Tên gói:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Giá gói (đvt: VNĐ):
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                value={formatPrice(price)}
                onChange={handlePriceChange}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Thời hạn hiệu lực (đvt: ngày):
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="number"
                min="1"
                value={duration}
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 0); // Prevent values < 1
                  setDuration(value);
                }}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Ngày bắt đầu:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Ngày kết thúc:
              </label>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Mô tả gói:
              </label>
              <textarea
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        )}

        {activeTab === "mangas" && (
          <div className="flex flex-col">
            {/* Search manga section */}
            <div>
              <input
                className="w-full py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
                type="text"
                placeholder="Nhập tên truyện muốn tìm..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>

            {/* Show search manga result */}
            <div className="h-48 overflow-y-auto">
              {searchMangas
                .filter(
                  (manga) =>
                    !selectedMangas.some(
                      (selected) => selected.mangaId === manga.mangaId
                    )
                )
                .map((manga) => (
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
                    <button
                      className="ml-auto px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => addToSelectedMangas(manga)}
                    >
                      Thêm
                    </button>
                  </div>
                ))}
            </div>

            <hr className="mb-2" />

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400 mr-2">
                Danh sách truyện thêm vào gói:
              </label>
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={canReadAll}
                    onChange={handleSelectCanReadAll}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    Cho phép đọc tất cả truyện trả phí
                  </span>
                </label>
              </div>
            </div>

            {/* Show selected manga */}
            <div className="h-48 overflow-y-auto">
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
                  <button
                    className="ml-auto px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    onClick={() => removeFromSelectedMangas(manga.mangaId)}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="p-2 py-1.5 px-3 bg-red-700 text-white rounded-md hover:bg-red-500"
            onClick={onClose}
          >
            Huỷ
          </button>
          <button
            className="p-2 py-1.5 px-3 bg-violet-700 text-white rounded-md hover:bg-violet-500"
            onClick={handleSave}
          >
            {plan ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}
