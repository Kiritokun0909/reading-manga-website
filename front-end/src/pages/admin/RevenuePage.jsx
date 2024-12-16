import { useEffect, useRef, useState } from "react";
import PaymentList from "../../components/admin/statistic/PaymentList";
import {
  getRevenueDetail,
  getRevenueFromToByPlan,
} from "../../api/StatisticService";
import { toast } from "react-toastify";
import { getListPlan } from "../../api/SiteService";
import HandleCode from "../../utilities/HandleCode";
import { LineGraph } from "../../components/admin/chart/LineGraph";

export default function RevenuePage() {
  const [searchName, setSearchName] = useState("");
  const [revenues, setRevenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const [searchPlanName, setSearchPlanName] = useState("");
  const [showResult, setShowResults] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState([]);

  const [revenueFromToLabels, setRevenueFromToLabels] = useState([]);
  const [revenueFromToDatasets, setRevenueFromToDatasets] = useState([]);

  const day = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [dateFrom, setDateFrom] = useState(
    new Date(day).toISOString().split("T")[0]
  );

  const ITEM_PER_PAGE = 5;

  //Fetch search result plans
  useEffect(() => {
    // if (searchPlanName === "" || searchPlanName.length < 3) return;

    const fetchSearchResult = async () => {
      try {
        const data = await getListPlan(
          5,
          1,
          HandleCode.FILTER_BY_UPDATE_DATE_DESC,
          searchPlanName
        );

        setSearchResult(data.plans);
      } catch (error) {
        console.log(error);
        toast.error("Đã có lỗi xảy ra!");
      }
    };

    fetchSearchResult();
  }, [searchPlanName]);

  const containerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchPlanRevenue = async (planId, from, to) => {
    try {
      const revenueData = await getRevenueFromToByPlan(from, to, planId);
      return Object.entries(revenueData).map(([date, revenue]) => ({
        date,
        revenue: parseFloat(revenue), // Ensure numbers are used
      }));
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra khi tải dữ liệu!");
      return [];
    }
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 50); // Limit to 0-99 for darker shades
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const updateLabelsAndDatasets = async () => {
      const allData = await Promise.all(
        selectedPlan.map((plan) =>
          fetchPlanRevenue(plan.planId, dateFrom, dateTo).then((data) => ({
            planId: plan.planId,
            label: plan.planName,
            data,
          }))
        )
      );

      // Combine all dates into a unique sorted list
      const allDates = Array.from(
        new Set(
          allData.flatMap((planData) => planData.data.map((item) => item.date))
        )
      ).sort((a, b) => new Date(a) - new Date(b));

      // Construct datasets with missing dates filled with 0
      const datasets = allData.map((planData) => {
        const dataMap = Object.fromEntries(
          planData.data.map(({ date, revenue }) => [date, revenue])
        );
        const filledData = allDates.map((date) => dataMap[date] || 0);
        return {
          label: planData.label,
          borderColor: getRandomColor(),
          data: filledData,
        };
      });

      // console.log(">>> allDates:", allDates);
      // console.log(">>> datasets:", datasets);

      setRevenueFromToLabels(allDates);
      setRevenueFromToDatasets(datasets);
    };

    if (selectedPlan.length > 0) {
      updateLabelsAndDatasets();
    } else {
      setRevenueFromToLabels([]);
      setRevenueFromToDatasets([]);
    }
  }, [selectedPlan, dateFrom, dateTo]);

  const addToSelectedPlan = (plan) => {
    setSelectedPlan((prevSelected) => [...prevSelected, plan]);
  };

  const removeFromSelectedPlan = (planId) => {
    setSelectedPlan((prevSelected) =>
      prevSelected.filter((p) => p.planId !== planId)
    );
  };

  const onSelectPlan = (plan) => {
    addToSelectedPlan(plan);
    setShowResults(false); // Assuming this hides some UI after selection
  };

  const onDeleteAllPlans = () => {
    setSelectedPlan([]);
    setRevenueFromToLabels([]);
    setRevenueFromToDatasets([]);
  };

  // Fetch revenue data table
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRevenueDetail(
          currentPage,
          ITEM_PER_PAGE,
          searchName
        );

        setRevenues(data.revenues);
        setTotalPage(data.totalPages);
      } catch (error) {
        console.log(error);
        toast.error("Đã có lỗi xảy ra!");
      }
    };

    fetchData();
  }, [currentPage, searchName]);

  const onPageChange = (page) => {
    setCurrentPage(page.selected + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mt-2 flex justify-center">
        <h1>Chi tiết doanh thu theo ngày</h1>
      </div>

      <div className="mt-8">
        <h5>So sánh doanh thu giữa các gói theo ngày</h5>
      </div>
      {/* Filter param for selected plan list and time */}
      <div className="mt-2 flex flex-row justify-between gap-4">
        {/* Search plan name */}
        <div className="flex flex-row">
          <label className="pt-2 mr-2">Nhập tên gói:</label>
          <div className="flex" ref={containerRef}>
            <div>
              <input
                className="rounded-md px-2 py-2 w-64"
                type="text"
                placeholder="Nhập tên gói muốn tìm..."
                value={searchPlanName}
                onChange={(e) => setSearchPlanName(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
            </div>
            <div className="absolute rounded-b-lg mt-10 flex flex-col bg-white w-64 z-10">
              {showResult && (
                <div>
                  {searchResult
                    .filter(
                      (plan) =>
                        !selectedPlan.some((p) => p.planId === plan.planId)
                    )
                    .map((plan) => (
                      <div
                        key={plan.planId}
                        className="w-64 color-black border-1 hover:bg-slate-300"
                      >
                        <button
                          className="w-full py-2 px-4 text-left"
                          onClick={() => onSelectPlan(plan)}
                        >
                          {plan.planName}
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date filter */}
        <div>
          <label className="pt-2 mr-2">Từ ngày:</label>
          <input
            className="rounded-md px-2 py-2"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <label className="mx-2 pt-2">đến ngày:</label>
          <input
            className="rounded-md px-2 py-2"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>

        <div className="">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-2 px-2 rounded"
            onClick={() => onDeleteAllPlans()}
          >
            Xoá tất cả
          </button>
        </div>
      </div>

      {/* Selected plan list result */}
      <div className="mt-2 p-2">
        <div className="flex flex-row justify-between">
          <div className=" flex flex-col">
            {/* <h6> Danh sách các gói:</h6> */}
            <div
              className="flex flex-wrap gap-2 px-2"
              style={{ maxWidth: "900px", minWidth: "400px" }}
            >
              {selectedPlan.map((plan) => (
                <div
                  key={plan.planId}
                  className="flex flex-row gap-2 py-1 px-2 bg-white rounded-md items-center"
                >
                  <span>{plan.planName}</span>
                  <button
                    className=" text-red-600 text-xl"
                    onClick={() => removeFromSelectedPlan(plan.planId)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <LineGraph
          labels={revenueFromToLabels}
          datas={revenueFromToDatasets}
          showLegend={true}
        />
      </div>

      {/* Search by username, email */}
      <div className="mt-2 py-2 border-t-2 border-gray-400">
        <div>
          <h5>Bảng chi tiết doanh thu</h5>
        </div>
        <div className="flex flex-row justify-end">
          <label className="pt-2 mr-2">Username, email:</label>
          <input
            className="rounded-md px-2 py-2 w-64"
            type="text"
            placeholder="Nhập username, email..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* Revenue table by username, email */}
      <div className="mt-2">
        <PaymentList
          payments={revenues}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
