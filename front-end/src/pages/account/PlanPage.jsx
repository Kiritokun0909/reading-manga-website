import { useEffect, useState } from "react";
import { getPurchaseHistory } from "../../api/AccountService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import PlanModal from "../../components/site/plan/PlanModal";

export default function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchPurchasePlans = async () => {
      try {
        const response = await getPurchaseHistory(currentPage, ITEMS_PER_PAGE);
        setPlans(response.plans);
        setTotalPages(response.totalPages);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPurchasePlans();
  }, [currentPage]);

  const onPageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);
  };

  const handleDetailClick = (planId) => {
    setSelectedPlanId(planId);
    setIsShowModal(true);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <h1>Danh sách các gói đã đăng ký</h1>
      </div>
      <div>
        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {plans.map((plan) => (
            <div
              className="flex flex-col pl-4 pr-2 py-2 rounded-lg bg-gray-300 border-1 w-96"
              key={plan.startAt}
            >
              <div className="flex flex-row justify-between">
                <div className="flex">
                  <span className="text-lg font-bold mr-2">
                    Gói {plan.planName}
                  </span>
                  {plan.planStatus === "active" ? (
                    <span className="text-green-500 font-bold">
                      Còn thời hạn
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold">
                      <i>Hết hạn</i>
                    </span>
                  )}
                </div>
                <div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDetailClick(plan.planId)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
              <div>
                <span className="">Giá: {formatPrice(plan.price)}</span>
              </div>
              <div>Ngày kích hoạt: {plan.startAt}</div>
              <div>Ngày hết hạn: {plan.endAt}</div>
            </div>
          ))}
        </div>

        {isShowModal && (
          <PlanModal
            planId={selectedPlanId}
            onClose={() => setIsShowModal(false)}
            isFromUser={true}
          />
        )}

        <ReactPaginate
          breakLabel="..."
          nextLabel="Trang kế"
          previousLabel="Trang trước"
          onPageChange={onPageChange}
          pageCount={totalPages}
          forcePage={currentPage - 1}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </div>
  );
}
