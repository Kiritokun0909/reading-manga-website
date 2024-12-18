import { useEffect, useState } from "react";
import HandleCode from "../../utilities/HandleCode";
import { toast } from "react-toastify";
import PlanModal from "../../components/admin/plan/PlanModal";

import { addPlan, deletePlan, updatePlan } from "../../api/AdminService";
import { getListPlan } from "../../api/SiteService";
import Loading from "../../components/Loading";
import PlanList from "../../components/admin/plan/PlanList";

export default function ManagePlanPage() {
  const [plans, setPlans] = useState([]);
  const [filterCode, setFilterCode] = useState(
    HandleCode.FILTER_BY_UPDATE_DATE_DESC
  );
  const [searchName, setSearchName] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await getListPlan(
          ITEMS_PER_PAGE,
          currentPage,
          filterCode,
          searchName
        );
        setPlans(response.plans);
        setTotalPages(response.totalPages);
      } catch (error) {
        // console.error("Error fetching subscriptions:", error);
        toast.error(error.message);
      }
    };

    fetchPlans();
  }, [currentPage, filterCode, searchName]);

  const fetchPlans = async () => {
    try {
      const response = await getListPlan(
        ITEMS_PER_PAGE,
        currentPage,
        filterCode,
        searchName
      );
      setPlans(response.plans);
      setTotalPages(response.totalPages);
    } catch (error) {
      // console.error("Error fetching subscriptions:", error);
      toast.error(error.message);
    }
  };

  const handlePageClick = (event) => {
    const page = event.selected + 1;
    setCurrentPage(page);
  };

  const handleAddButton = () => {
    setSelectedPlan(null);
    setIsShowModal(true);
  };

  const handleEditClick = (plan) => {
    setSelectedPlan(plan);
    setIsShowModal(true);
  };

  const onSavePlan = async (plan) => {
    setIsLoading(true);
    // console.log(plan);
    try {
      if (selectedPlan) {
        console.log("Update plan");
        await updatePlan(
          plan.planId,
          plan.planName,
          plan.price,
          plan.duration,
          plan.description,
          plan.startAt,
          plan.endAt,
          plan.canReadAll,
          plan.mangaIds
        );
        toast.success("Cập nhật gói thành công.");
      } else {
        console.log("Add new plan");
        await addPlan(
          plan.planName,
          plan.price,
          plan.duration,
          plan.description,
          plan.startAt,
          plan.endAt,
          plan.canReadAll,
          plan.mangaIds
        );
        toast.success("Thêm gói mới thành công.");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
    setIsShowModal(false);
    fetchPlans();
    setIsLoading(false);
  };

  const onDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      toast.success("Xóa gói đăng ký thành công.");
    } catch (error) {
      toast.error(error.message);
    }
    fetchPlans();
  };

  return (
    <>
      {isLoading && <Loading />}

      <div className="flex flex-col p-4 pt-0 w-full">
        {/* Header */}
        <div className="flex justify-center py-4">
          <h1>Danh sách các gói đăng ký</h1>
        </div>

        {/* Search and filter */}
        <div className="flex flex-row justify-end pb-4">
          <div className="flex">
            <label className="pt-2 mr-1">Tên gói:</label>
            <input
              type="text"
              placeholder="Nhập tên gói đăng ký..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-96 mr-4 py-1 color-black border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100"
            />
          </div>

          <div className="flex ml-4">
            <label className="w-24 pt-2 mr-1">Sắp xếp:</label>
            <select
              defaultValue={filterCode}
              onChange={(e) => setFilterCode(e.target.value)}
              className="form-select"
            >
              <option value={HandleCode.FILTER_BY_UPDATE_DATE_DESC}>
                Ngày cập nhật giảm dần
              </option>
              <option value={HandleCode.FILTER_BY_UPDATE_DATE_ASC}>
                Ngày cập nhật tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_CREATE_DATE_ASC}>
                Ngày tạo tăng dần
              </option>
              <option value={HandleCode.FILTER_BY_CREATE_DATE_DESC}>
                Ngày tạo giảm dần
              </option>
            </select>
          </div>

          <div className="flex flex-row-reverse ml-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddButton}
            >
              Thêm gói mới
            </button>
          </div>
        </div>

        <div>
          <PlanList
            plans={plans}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageClick}
            onDetailClick={handleEditClick}
            onDeleteClick={onDeletePlan}
          />
        </div>

        {isShowModal && (
          <PlanModal
            plan={selectedPlan}
            onClose={() => setIsShowModal(false)}
            onSave={onSavePlan}
          />
        )}
      </div>
    </>
  );
}
