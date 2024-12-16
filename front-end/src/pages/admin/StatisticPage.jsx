import { useEffect, useState } from "react";
import { BarGraph } from "../../components/admin/chart/BarGraph";
import { LineGraph } from "../../components/admin/chart/LineGraph";
import { formatPrice } from "../../utilities/utils";

import {
  getRevenueFromTo,
  getTopSalePlans,
  getTotalActivePlan,
  getTotalActiveUser,
  getTotalManga,
} from "../../api/StatisticService";
import { Link } from "react-router-dom";

export default function StatisticPage() {
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [totalManga, setTotalManga] = useState(15);
  const [totalActivePlan, setTotalActivePlan] = useState(0);
  const [totalActiveUser, setTotalActiveUser] = useState(0);

  const day = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [dateFrom, setDateFrom] = useState(
    new Date(day).toISOString().split("T")[0]
  );
  const [revenueFromToLabels, setRevenueFromToLabels] = useState([]);
  const [revenueFromToDatas, setRevenueFromToDatas] = useState([]);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [topSalePlanLabels, setTopSalePlanLabels] = useState([]);
  const [topSalePlanDatas, setTopSalePlanDatas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalActiveUserData = await getTotalActiveUser();
        const totalMangaData = await getTotalManga();
        const totalActivePlanData = await getTotalActivePlan();

        setTotalActiveUser(totalActiveUserData.totalActiveUser);
        setTotalManga(totalMangaData.totalManga);
        setTotalActivePlan(totalActivePlanData.totalActivePlan);

        const currentDate = new Date();
        const firstDayOfMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}-01`;

        const totalRevenueData = await getRevenueFromTo(
          firstDayOfMonth,
          currentDate.toISOString().split("T")[0]
        );
        const totalRevenue = Object.values(totalRevenueData).reduce(
          (sum, revenue) => sum + parseFloat(revenue), // Ensure revenue is treated as a number
          0 // Initial value for the sum
        );
        setMonthRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Fetch data get revenue from day to day
  useEffect(() => {
    const fetchRevenueFromTo = async (from, to) => {
      try {
        const revenueFromToData = await getRevenueFromTo(from, to);
        const labels = Object.keys(revenueFromToData);
        const data = Object.values(revenueFromToData).map((revenue) =>
          parseFloat(revenue)
        ); // Convert revenue strings to numbers

        setRevenueFromToLabels(labels);
        setRevenueFromToDatas([
          {
            label: "Doanh thu",
            borderColor: "rgb(2, 41, 184)",
            data: data,
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchRevenueFromTo(dateFrom, dateTo);
  }, [dateFrom, dateTo]);

  // Fetch data get top 5 plan by month and year
  useEffect(() => {
    const fetchTopSalePlan = async (month, year) => {
      try {
        const topSalePlanData = await getTopSalePlans(month, year);
        const labels = Object.keys(topSalePlanData);
        const data = Object.values(topSalePlanData).map((numPurchased) =>
          parseFloat(numPurchased)
        ); // Convert revenue strings to numbers

        setTopSalePlanLabels(labels);
        setTopSalePlanDatas(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTopSalePlan(month, year);
  }, [month, year]);

  return (
    <div>
      <div className="flex justify-center mt-2">
        <h1>Thống kê</h1>
      </div>

      <div className="flex flex-row justify-around gap-5 mt-2">
        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
            Doanh thu tháng này
          </div>
          <div className="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">
            {formatPrice(monthRevenue)}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
            Tổng số truyện đã đăng
          </div>
          <div className="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">
            {totalManga}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
            Số gói đang có hiệu lực hiện tại
          </div>
          <div className="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">
            {totalActivePlan}
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
          <div className="text-sm leading-5 font-medium text-gray-500 truncate dark:text-gray-400">
            Lượng người dùng
          </div>
          <div className="mt-1 text-3xl leading-9 font-semibold text-indigo-600 dark:text-indigo-400">
            {totalActiveUser}
          </div>
        </div>
      </div>
      <hr />

      {/* Detail revenue from date to date */}
      <div className="flex flex-col my-2">
        <div className="flex justify-between gap-2">
          <div className="flex flex-col mb-2">
            <div className="flex flex-row gap-2">
              <h4 className="mb-0">Doanh thu theo ngày</h4>
              <Link className="pt-1" to="/admin/detail-revenue">
                Xem chi tiết {">>"}
              </Link>
            </div>
            <span className="font-xs">
              <i>(đơn vị tính: VNĐ)</i>
            </span>
          </div>
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
        </div>
        <LineGraph labels={revenueFromToLabels} datas={revenueFromToDatas} />
      </div>
      <hr />

      {/* Filter top most bought, register plan */}
      <div className="flex flex-col my-2">
        <div className="flex justify-between">
          <h4 className="mb-0">Top các gói được mua nhiều trong tháng</h4>
          <div>
            <label className="pt-2 mr-2">Tháng:</label>
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              placeholder="Month"
              className="border rounded px-2 py-1 mx-1"
            />
            <label className="mx-2 pt-2">Năm:</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              placeholder="Year"
              className="border rounded px-2 py-1 mx-1"
            />
          </div>
        </div>
        <BarGraph labels={topSalePlanLabels} datas={topSalePlanDatas} />
      </div>
    </div>
  );
}
